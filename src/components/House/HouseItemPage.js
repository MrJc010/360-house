import React, {Component} from 'react';

import {withFirebase} from '../Firebase';

import * as ROUTES from '../../constants/routes';

class HouseItemPageBase extends Component {
  constructor(props){
    super(props);

    this.state = {
      house: null,
      isLoading: false,
      ...props.location.state,
    }
  }

  onRemoveHouse = event => {
    this.props.firebase.house(this.state.house.uid).remove()
    .then(() => {
      this.setState({house: null});
      this.props.history.push(ROUTES.HOUSE);
    });
  };

  componentDidMount() {
      if (this.state.house) {
      return;
    }
    this.setState({isLoading: true});
    this.props.firebase
    .house(this.props.match.params.id)
    .on('value', snapshot => {
      this.setState({
        house: snapshot.val(),
        isLoading: false,
      });
    })
  }

  componentWillUnmount() {
    this.props.firebase.house(this.props.match.params.id).off();
  }

  render(){
    const {house, isLoading} = this.state;
    return(
      <div>
        <h2>House ({this.props.match.params.id})</h2>
        {isLoading && <div>Loading ...</div>}

        {house && (
          <div>
          <span>
          <strong>House ID:</strong> {house.uid}
          </span>
          <span>
          <strong>Name:</strong> {house.name}
          </span>
          <span>
          <strong>Adress:</strong> {house.address}
          </span>

          {/*
          TODO: pop up or some type of alert to user to remind
          that house that get delete can not be recover
           */}
          <button
          type="button"
          onClick={this.onRemoveHouse}>
            Delete this house
          </button>

          </div>

        )}
      </div>
    );
  }
}
const HouseItemPage = withFirebase(HouseItemPageBase);

export default HouseItemPage;
