import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import DeleteButton from "./DeleteButton";
import CompareButton from "./CompareButton";

export default function Category(props) {
  const categoryArray = props.categories.map((category, index) => {
    return (
      <Tab
        key={category.id}
        value={category.id}
        label={category.name}
        aria-controls={`simple-tabpanel-${index}`}
      />
    );
  });

  return (
    <AppBar position="static" color="default">
      <Tabs
        value={props.catSelected}
        onChange={(e, value) => props.handleChange(value)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {categoryArray}

        <CompareButton
          selectedIDs={props.selectedProductIDs}
          features={props.features}
          handleClick={props.handleClick}
        />
        <DeleteButton onClick={props.onClick} />
      </Tabs>
    </AppBar>
  );
}
