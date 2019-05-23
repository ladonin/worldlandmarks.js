import React, { Component } from 'react';

class Map extends Component {

  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      list: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getUsers();
  }

  // Retrieves the list of items from the Express app
  getUsers = () => {
    fetch('/api/get_users')
    .then(res => res.json())
    .then(list => this.setState({ list }))
  }


  render() {
    const { list } = this.state;

    return (
      <div className="App">
        <h1>List of Users</h1>
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

export default Map;
