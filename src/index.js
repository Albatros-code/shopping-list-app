import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.min.css';
import './css/shopping-list-app.css';

class SearchBar extends React.Component {
  constructor(props){
    super(props);

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.filterText(e.target.value);
  }

  render() {
    return (
      <input
        type="text"
        placeholder="Search..."
        className="form-control"
        value={this.props.value}
        onChange={(e) => this.handleFilterTextChange(e)}
      />
    )
  }
}

class ToggleButton extends React.Component {
  render(){
    const  btnToggled = this.props.toggleButton.toLowerCase() === this.props.label.toLowerCase() ? " btn-toggled" : "";

    return (
      <button  type="button" className={"btn btn-look" +  btnToggled} onClick={(label) => this.props.handleClick(this.props.label)}>{this.props.label}</button>
    )
  }
}

function ProductRow(props) {
    return (
      <tr onClick = {props.handleClick} className={props.isClicked ? "bold" : ""}><td>{props.name}</td></tr>
    )
}

class ProductTable extends React.Component {
  render() {
    const productRows = [];
    for (let i = 0; i < this.props.products.length; i++){

      if (
        this.props.products[i].name.toLowerCase().includes(this.props.filterText.toLowerCase()) &&

        (this.props.toggleButton === "all" ||
        this.props.toggleButton === this.props.products[i].category.toLowerCase())
      ){

        const clicked = isClicked(this.props.products[i].name, this.props.selectedProducts)
        productRows[i] = <ProductRow
                            key={"product-row-" + i}
                            name={this.props.products[i].name}
                            handleClick={() => this.props.handleClick(i)}
                            isClicked={clicked}
                          />;
      }
    }

    return(
      <table className="table table-hover table-sm">
        <tbody>
          {productRows}
        </tbody>
      </table>
    )
  }
}

class QuantityCounter extends React.Component {
  render () {
    const hidden = this.props.hover ? "" : " hidden"
    return (
      <div className="row align-items-center">
        <div className={"col counter" + hidden}>
          <div className="row counter-button counter-button-add" onClick={this.props.counterChangeAdd}></div>
          <div className="row counter-button counter-button-remove" onClick={this.props.counterChangeRemove}></div>
        </div>
        <div className="col counter scroll-offset">{this.props.quantity}</div>
      </div>
    )
  }
}

class ShoppingListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
    }
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    this.setState({hover:!this.state.hover})
  }

  handleMouseLeave() {
    this.setState({hover:!this.state.hover})
  }

  render() {
    let content = ""
    if (this.props.type === "Single") {
      content = this.props.name;
    } else {
      const index = findIndexByName(this.props.name, this.props.products);
      const product = this.props.products[index];
      var components = "";

      for (let i = 1; i < 10; i++) {
        if (product.hasOwnProperty("ingNam" + i)) {
          components = components + (product["ingNam" + i] + "\u00A0" + product["ingQty" + i]+ ",\u00A0")

        } else {
          break;
        }
      }
      content = <span>{this.props.name}
                  <p className="list-description">{components}</p>
                </span>;
    }

    return (
      <tr
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <td onClick={this.props.handleClick}>{content}</td>
        <td className="counter-table vertical-align-middle">
          <QuantityCounter
            hover={this.state.hover}
            quantity={this.props.quantity}
            counterChangeAdd={this.props.counterChangeAdd}
            counterChangeRemove={this.props.counterChangeRemove}
          />
        </td>
      </tr>
    )
  }
}

class ShoppingList extends React.Component {

  whatRowType(i) {
     const productName = this.props.selectedProducts[i].name;
     const products = this.props.products;
     for (let i = 0; i < products.length; i++) {
       if (products[i].name === productName) {
         return products[i].category;
       }
     }
   }

   compareByName(a, b) {
     if ( a.props.name < b.props.name ){
       return -1;
     }
     if ( a.props.name > b.props.name ){
       return 1;
     }
     return 0;
   }

  render () {
    const productRows = [];
    for (let i = 0; i < this.props.selectedProducts.length; i++){
      productRows[i] = <ShoppingListRow
                          key={"product-row-" + i}
                          name={this.props.selectedProducts[i].name}
                          quantity={this.props.selectedProducts[i].quantity}
                          type={this.whatRowType(i)}
                          handleClick={() => this.props.handleClick(i)}
                          counterChangeAdd={(action) => this.props.counterChange(i, "add")}
                          counterChangeRemove={(action) => this.props.counterChange(i, "remove")}
                          products={PRODUCTS}
                        />;
    }

    productRows.sort(this.compareByName);

    return (
      <table className="table table-hover table-sm">
        <tbody>
          {productRows}
        </tbody>
      </table>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProducts: [
        //{name: "cebula", quantity:5},
      ],
      toggleButton: "all",
      filterText: "",
    }
  }

  selectingProduct(i) {
    const selectedProduct = [{name: this.props.products[i].name, quantity: 1}]
    if (!isClicked(selectedProduct[0].name, this.state.selectedProducts)){
      this.setState({selectedProducts: this.state.selectedProducts.concat(selectedProduct)})
    }
  }

  removeProduct(i) {
    const updatedList1 = this.state.selectedProducts.slice(0, i);
    const updatedList2 = this.state.selectedProducts.slice(i+1);
    const updatedList = updatedList1.concat(updatedList2);
    this.setState({selectedProducts: updatedList});
  }

  counterChange(i, action) {
    const selectedProducts = this.state.selectedProducts.slice();
    const counter = selectedProducts[i].quantity;
    if (action === "add") {
      selectedProducts[i].quantity = counter + 1;
      this.setState({selectedProducts:selectedProducts});
    } else if (action === "remove") {
      if (counter > 0) {
        selectedProducts[i].quantity = counter - 1
        this.setState({selectedProducts:selectedProducts});
      }
    }
  }

  filterText(input) {
    this.setState({filterText: input});
  }

  toggleButton(label) {
    this.setState({toggleButton: label.toLowerCase()});
  }

  render() {
    return (
      <div className="container" id="app">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="display-4">
              Shopping List App
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <p className="text-center">Products</p>
            <SearchBar
              filterText={(input) => this.filterText(input)}
              value={this.state.filterText}/>
            <div className="row justify-content-around list-filter-buttons">
              <ToggleButton label="All" toggleButton={this.state.toggleButton} handleClick={(label) => this.toggleButton(label)}/>
              <ToggleButton label="Single" toggleButton={this.state.toggleButton} handleClick={(label) => this.toggleButton(label)}/>
              <ToggleButton label="Set" toggleButton={this.state.toggleButton} handleClick={(label) => this.toggleButton(label)}/>
            </div>
            <div className="product-list-height-const">
              <ProductTable
                products={this.props.products}
                handleClick={(i) => this.selectingProduct(i)}
                selectedProducts={this.state.selectedProducts}
                toggleButton={this.state.toggleButton}
                filterText={this.state.filterText}
              />
            </div>
          </div>
          <div className="col-6">
            <p className="text-center">Shopping List Preview</p>
              <div className="shopping-list-height-const">
                <ShoppingList
                  selectedProducts={this.state.selectedProducts}
                  products={this.props.products}
                  handleClick={(i) => this.removeProduct(i)}
                  counterChange={(i, action) => this.counterChange(i, action)}
                />
              </div>
          </div>
        </div>
      </div>
    );
  }
}

function isClicked(name, list) {
  for (let i= 0; i < list.length; i++) {
    if (list[i].name === name) {
      return true
    }
  }
  return false
}

function findIndexByName(name, list) {
   for (let i = 0; i < list.length; i++) {
     if (list[i].name === name) {
       return i;
     }
   }
 }

function compareByName(a, b) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

const productsInput = [
  {category: 'Set', name: 'Curry z dynią',
    ingNam1: 'Cebula', ingQty1: '1',
    ingNam2: 'Czosnek', ingQty2: '1',
    ingNam3: 'Pomidory w puszce', ingQty3: '1',
    ingNam4: 'Mięso mielone', ingQty4: '1'},
  {category: 'Single', shopPosition1: '1', shopPosition2: '5', name: 'Chleb'},
  {category: 'Single', shopPosition1: '6', shopPosition2: '5', name: 'Mleko'},
  {category: 'Single', shopPosition1: '3', shopPosition2: '6', name: 'Woda'},
  {category: 'Single', shopPosition1: '7', shopPosition2: '4', name: 'Banan'},
  {category: 'Single', shopPosition1: '5', shopPosition2: '8', name: 'Cytryna'},
  {category: 'Single', shopPosition1: '9', shopPosition2: '2', name: 'Cebula'},
  {category: 'Single', shopPosition1: '7', shopPosition2: '9', name: 'Pomidory w puszce'},
  {category: 'Single', shopPosition1: '4', shopPosition2: '8', name: 'Fasola'},
  {category: 'Single', shopPosition1: '3', shopPosition2: '4', name: 'Marchewka'},
  {category: 'Single', shopPosition1: '6', shopPosition2: '9', name: 'Jogurt'},
  {category: 'Single', shopPosition1: '6', shopPosition2: '1', name: 'Twaróg'},
  {category: 'Single', shopPosition1: '4', shopPosition2: '8', name: 'Płatki owsiane'},
  {category: 'Single', shopPosition1: '2', shopPosition2: '5', name: 'Płatki orkiszowe'},
  {category: 'Single', shopPosition1: '7', shopPosition2: '1', name: 'Płatki do mleka'},
  {category: 'Single', shopPosition1: '9', shopPosition2: '7', name: 'Płatki Jaglane'},
  {category: 'Single', shopPosition1: '1', shopPosition2: '5', name: 'Pietruszka'},
  {category: 'Single', shopPosition1: '8', shopPosition2: '2', name: 'Szczypiorek'},
  {category: 'Set', name: 'Spaghetti',
    ingNam1: 'Cebula', ingQty1: '1',
    ingNam2: 'Czosnek', ingQty2: '1',
    ingNam3: 'Pomidory w puszce', ingQty3: '1',
    ingNam4: 'Mięso mielone', ingQty4: '1'},
  {category: 'Set', name: 'Chilli S. Jurka',
    ingNam1: 'Cebula', ingQty1: '1',
    ingNam2: 'Czosnek', ingQty2: '1',
    ingNam3: 'Pomidory w puszce', ingQty3: '1',
    ingNam4: 'Mięso mielone', ingQty4: '1'},
];
const PRODUCTS = productsInput.sort(compareByName);

// ========================================

ReactDOM.render(
  <App products={PRODUCTS}/>,
  document.getElementById('root')
);
