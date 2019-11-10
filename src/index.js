import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.min.css';
import './css/shopping-list-app.css';

class SearchBar extends React.Component {
  render() {
    return (
      <input type="text" placeholder="Search..." className="form-control"/>
    )
  }
}

class ToggleButton extends React.Component {
  render(){
    return (
      <button  type="button" className="btn btn-secondary">{this.props.label}</button>
    )
  }
}

class ProductRow extends React.Component {
  render() {
    return (
      <tr><td>{this.props.name}</td></tr>
    )
  }
}

class ProductTable extends React.Component {
  render() {
    const productRows = [];

    for (let i = 0; i < this.props.products.length; i++){
      productRows[i] = <ProductRow key={"product-row-" + i} name={this.props.products[i].name}/>;
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
  constructor(props) {
    super(props);
    this.state = {
      counter: 1,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(action) {
    if (action === "add") {
      let counter = this.state.counter;
      this.setState({counter:counter + 1});
    } else if (action === "remove") {
      let counter = this.state.counter;
      if (counter > 0) {
        this.setState({counter:counter + -1});
      } else {
        counter = 0;
      }
    }
  }

  render () {
    const hidden = this.props.hover ? "" : " hidden"

    return (
      <div className="row align-items-center">
        <div className={"col counter" + hidden}>
          <div className="row counter-button counter-button-add" onClick={() => this.handleClick("add")}></div>
          <div className="row counter-button counter-button-remove" onClick={() => this.handleClick("remove")}></div>
        </div>
        <div className="col counter scroll-offset">{this.state.counter}</div>
      </div>
    )
  }
}

class ShoppingListRow extends React.Component {
  constructor(props) {
    super()
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
  //  const hidden = this.state.hover ? "" : " hidden"

    return (
      <tr
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <td>{this.props.name}</td>
        <td className="counter-table"><QuantityCounter hover={this.state.hover}/></td>
      </tr>
    )
  }
}

class ShoppingList extends React.Component {
  render () {
    const productRows = [];

    for (let i = 0; i < this.props.products.length; i++){
      productRows[i] = <ShoppingListRow key={"product-row-" + i} name={this.props.products[i].name}/>;
    }

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
            <SearchBar />
            <div className="row justify-content-around"><ToggleButton label="All" /><ToggleButton  label="Single"/><ToggleButton  label="Set"/></div>
            <div className="product-list-height-const smooth-scroll">
            <ProductTable products={this.props.products} />
            </div>
          </div>
          <div className="col-6">
            <p className="text-center">Shopping List Preview</p>
              <div className="shopping-list-height-const">
                <ShoppingList products={this.props.products} />
              </div>
          </div>
        </div>
      </div>
    );
  }
}

const PRODUCTS = [
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
];

// ========================================

ReactDOM.render(
  <App products={PRODUCTS}/>,
  document.getElementById('root')
);
