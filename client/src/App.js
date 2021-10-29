import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { getProducts, createSearchlist } from "./helper/selector";
import Product from "./components/Product";
import Category from "./components/Category";
import Navbar from "./components/Navbar";
import CompBubble from "./components/CompBubble";
import CompBubbleElement from "./components/CompBubbleElement";
import DeleteButton from "./components/DeleteButton";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Button from "./components/Button";

// For the floating Compare button
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';

const reorder = (list, startIndex, endIndex) => {
  console.log('list', list)
    const result = Array.from(list);
    console.log('result', result)
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    console.log('result2', result)
    
    return result;
}



const sendComparison = (products) => {
  
  
  axios.post('/api/comparisons', {
    user_id: 1,
    product_ids: products
  })

}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  console.log('sourceclone', sourceClone)
  console.log('destination in move function', destination)
  const destClone = Array.from(destination);
  console.log('destClone', destClone)
  const newDest = sourceClone[droppableSource.index]
  console.log('newDest', newDest)
  sourceClone.splice(droppableSource.index, 1);
  destClone.splice(0, 1)
  destClone.push(newDest);
  console.log('newDest2', destClone)

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  console.log(result)

  return result;
};




export default function Application(props) {
  const [state, setState] = useState({
    products: [],
    categories: [],
    searchArray: [],
    features: [],
    searchValue: "",
    catSelected: 1,
    selected: 1,
    comparison: [],
    mode: 'cat',
    productComparison: []
    

  });

  let id2List = {
    id: 'products',
    droppable: 'products',
    droppable2: 'comparison'
  }
  

  let getList = id => {
    return state[id2List[id]]
  }

  let styleObject = {style: 'col'}
  
  let onDragStart = () => {
    console.log('im dragging')
    return styleObject.style = 'card-compare'
  }

  let onDragEnd = result => {
    styleObject.style = 'col'
    
    const { source, destination } = result;

    // dropped outside the list
    if (!destination || destination.droppableId === 'product') {
        return;
    }
    console.log("destinatiomn", destination)

    if (source.droppableId === destination.droppableId) {
      console.log('source1', source)
        const products = reorder(
           getList(source.droppableId),
            source.index,
            destination.index
        );
        console.log('products', state.products)
        console.log('source', source)
        let value =  state.products[source.index] ;
        console.log('value', value)

        if (source.droppableId === 'droppable2') {
            value =  state.catSelected[source.index - 1] ;
           let productsHistory = state.comparisons.products;
           productsHistory.pop()
           productsHistory.push(value)
           let stateComparisons = state.comparisons
           let comparisons = {...stateComparisons, products: productsHistory}

           setState((prev) => ({ ...prev, selected: value.id, comparisons}));
           console.log('DRAGGED STATE', state)
           sendComparison(productsHistory)
        }

        
    } else {
      console.log('destination.droppableId', destination.droppableId)

        const result = move(
            getList(source.droppableId),
            getList(destination.droppableId),
            source,
            destination
        );

        console.log('destination2', destination)
        console.log('source2', source)

        setState((prev) => ({ ...prev, 
          product: result.droppable,
          comparison: result.droppable2 }))
    }
};



const [open, setOpen] = useState(false);
  
  const handleChange = (catSelected, mode = "cat") => {
    //set selection to the value selected
    setState((prev) => ({ ...prev, catSelected, mode }));
  };
  const updateSearch = (e, value, mode = "search") => {
    //set selection to the value selected
    if (!value) {
      e.preventDefault();
      return;
    }
    setState((prev) => ({ ...prev, mode, searchSelected: value }));
  };
  
  const [selectedProductIDs, setSelectedProductIDs] = useState([]);
  const history = useHistory();

  const addProdIDs = (id) => {
    setSelectedProductIDs((prev) => {
      return [...prev, id];
    });
  }
  
  const removeProdIDs = (id) => {
    setSelectedProductIDs((prev) => {
      const index = prev.findIndex((e) => e === id);
      prev.splice(index, 1);
      return prev;
    });
  }
  
  useEffect(() => {
    const URL1 = "/api/products";
    const URL2 = "/api/categories";
    const URL3 = "/api/features";
    const URL4 = "/api/comparisons/index"

    Promise.all([axios.get(URL1), axios.get(URL2), axios.get(URL3), axios.get(URL4)]).then(
      (all) => {
        console.log(all);

        const [first, second, third, fourth] = all;
        console.log(fourth.data);
        const products = first.data.products;
        const categories = second.data.categories;
        const features = third.data.features;
        const featuretypes = third.data.types;
        const comparison = fourth.data.comparisons;
        const productComparison = fourth.data.products;
        console.log('comparison data', comparison)
        console.log('productcomparison data', productComparison)
        const searchArray = createSearchlist(featuretypes);
        // const searchArray = originalsearchArray.slice(0, 10);
        setState((prev) => ({
          ...prev,
          products,
          categories,
          features,
          searchArray,
          comparison, 
          productComparison
        }));
      }
    );
  }, []);

  // const searchList = state.searchArray.filter(
  //   (post) =>
  //     state.query && post.name.toLowerCase().includes(state.query.toLowerCase())
  // );
  const firstset = getProducts({ ...state });
  console.log("products", state.mode, firstset);
  const productArray = firstset.map((product, index) => {
    let id = (product.id).toString();
    return (
      <Draggable key={product.id} draggableId={id} index={index}>
        {(provided) => (
          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Product
          
          key={product.id}
          id={product.id}
          name={product.name}
          image={product.image}
          description={product.description}
          price_cents={product.price_cents}
          rating={product.rating}
          sale={product.sale}
          url={product.url}
          category_id={product.category_id}
          addProdIDs={addProdIDs}
          removeProdIDs={removeProdIDs}
          style={styleObject}
          handleSelect={handleSelect}
          
        />
        </li>
        )}
        
      </Draggable>
    );
  });
 
  const compareArray = []
  
  const onDelete = () => {
    let comparison = {id: 1, name: ['compare here', 'compare here', 'compare here']}
    let productComparison = [{id: 1, name: 'compare here'}, {id: 2, name: 'compare here'}, {id: 3, name: 'compare here'}]
    setState((prev) => ({ ...prev, comparison, productComparison }));
  }
  

   const compareArrayMapped = state.productComparison.map((comparison_id, index) => {
      
      let comparison = state.comparison
      
      let id = (comparison.id).toString();
      return (
        <Draggable key={comparison.id} draggableId={id} index={index}>
          {(provided) => (
          
           
          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
            <CompBubbleElement
          key={comparison.id}
          id={comparison.id}
          name={comparison_id.name}
          />
          
          </li>
         
          
          )}
          
        </Draggable>
         
      );
    });
  compareArray.push(compareArrayMapped)

  
  const handleSelect = () => {
    return onDragEnd
  }
  
  const handleClick = () => {
    history.push({
      pathname: '/comparison',
      selectedIDs: selectedProductIDs,
      features: state.features
    });
  };

  return (
    <div>
      <div>
        <Navbar
          searchList={state.searchArray}
          searchSelected={state.searchSelected}
          updateSearch={updateSearch}
          open={open}
        />
        <Category
          categories={state.categories}
          catSelected={state.catSelected}
          handleChange={handleChange}
        ></Category>
        <DeleteButton onClick={onDelete}></DeleteButton>
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab variant="extended">
              <NavigationIcon sx={{ mr: 1 }} />
                Compare
            </Fab>
        </Box>
      </div>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
           <ul className="drag" {...provided.droppableProps} ref={provided.innerRef}>
             {provided.placeholder}
           <div className="container">
             {/* <div className="row">{categoryArray}</div> */}
             <div className="row">{productArray}</div>
             <Button onClick={handleClick}>Compare</Button>
             
           </div>
           </ul>
           )}
           </Droppable>

           <Droppable droppableId="droppable2">
             {(provided, snapshot) => (
                 <ul
                 ref={provided.innerRef}
                 {...provided.draggableProps}
                 {...provided.dragHandleProps}>
                 {provided.placeholder}
                 <div className="footer">
                 
                   {compareArray}
                   {provided.placeholder}
                   
                 
                 </div>
                 
                 </ul>
                  
             )}
          
          
      </Droppable>
      </DragDropContext>
     
    </div>
   
  );
}