import React, { Component } from 'react';

import { TASK_STATUSES } from '../constants';

class Task extends Component {

  render() {return(
    <div className="task" >
      <div className="task-header" style={{background: this.props.task.color}}>
        <div>{this.props.task.title}</div>
        <select value={this.props.task.status} onChange={this.onStatusChange}>
          {TASK_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <hr />
      <div className="task-body">{this.props.task.description}</div>
      <button onClick={this.onClickTest} >test</button>
    </div>
  )}


  onClickTest = (e) => {
    this.props.onClickTest(this.props.task, e.target.value);
  }

  onStatusChange = (e) => {
    this.props.onStatusChange(this.props.task.id, e.target.value);
  }
}

export default Task;
