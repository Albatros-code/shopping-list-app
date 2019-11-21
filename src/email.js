import React from 'react';
import emailjs from 'emailjs-com';

function sendEmail(email) {
  console.log("Email sent!");
  emailjs.init("user_I78KDOjHq76yf6MNc8KLo");

  var params = {
    date: '20.11.2019',
    //list: 'Jajka 50\nCebula 30\nPiwo 2',
    list: 'Jajka 50\nCebula 30\nPiwo 2',
    email: email,
  };

  console.log(params)

/*  emailjs.send('zakupywlidlu71_gmail_com', 'shoppinglistapp', params)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
      console.log('FAILED...', error);
    });*/

}

class SendEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.setState({email: e.target.value});
  }

  render() {
    return (
      <div className="row">
        <div className="col-8">
          <input value={this.state.text} type="email" onChange={(e) => this.handleFilterTextChange(e)} className="form-control" placeholder="e-mail"/>
        </div>
        <div className="col-4">
          <button className={"btn btn-look btn-block"} onClick={() => sendEmail(this.state.email)}>Send</button>
        </div>
      </div>

   )
  }
}

export default SendEmail;
