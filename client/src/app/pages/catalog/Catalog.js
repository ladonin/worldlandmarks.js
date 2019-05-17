import React, { Component } from 'react';

class Catalog extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      list: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch('/api/get_list')
    .then(res => res.json())
    .then(list => this.setState({ list }))
  }


//  getList = () => {
//    fetch('https://api.github.com/users/github',{mode: 'cors'})
//    .then(res => { return res.json()})
//    .then(list => {console.log(list);   return this.setState({ list:[list.avatar_url ]})})
//    .catch(err => {throw(err)})
//  }








  render() {
    const { list } = this.state;

    return (
      <div className="App">
        <h1>List of Itemsssssssdfsssss</h1>
        {
        /* Render the list of items */
        list.length ? (
          <div>
            {
            /* Render the list of items */
            list.map((item) => {
              return(
                <div>
                  {item}
                </div>
              );
            })}
          </div>
        ) : (
          <div>

          </div>
        )
      }
      </div>
    );
  }
}

export default Catalog;
