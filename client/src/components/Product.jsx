import { useState } from "react";
import "./Product.css";

export default function Product(props) {
  const [selected, setSelected] = useState(false);

  const toggleSelected = () => {
    if (selected) {
      setSelected(false);
      document.getElementById(`heart${props.index}`).style.color = "#989898";
      props.removeProdIDs(props.id);
    } else {
      setSelected(true);
      document.getElementById(`heart${props.index}`).style.color = "red";
      props.addProdIDs(props.id);
    }
  };

  return (
    <div className="col">
      <div className="card">
        <span id={`heart${props.index}`} className="heart">
          {!selected && (
            <i
              onClick={() => {
                toggleSelected();
              }}
              className="fas fa-compress"
            ></i>
          )}
          {selected && (
            <i
              onClick={() => {
                toggleSelected();
              }}
              className="fas fa-compress-arrows-alt"
            ></i>
          )}
        </span>
        <img src={props.image} className="first-image" alt="" />

        {/* <div className="card-body">
          <div></div>
          <hr />
          <center>
            <h5 className="card-title">{props.name}</h5>
          </center>
        </div> */}
      </div>
    </div>
  );
}
