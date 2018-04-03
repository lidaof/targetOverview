import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

import myData from './atac_summary.json';

//console.log(myData);

const data = [{ x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
{ x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
{ x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 }];

const colors = {
  'Bartolomei Lab':'red',
  'Biswal Lab':'green',
  'Dolinoy Lab':'pink',
  'Mutlu Lab': 'yellow'
};

class App extends Component {
  render() {
    return (
      <div className="App">
      <h1>Useful Reads</h1>
      <ScatterChart width={1200} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="number" dataKey='Date' name='Date'/>
        <YAxis type="number" dataKey={'Useful_reads'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name='useful_reads' data={myData.data} fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
    </ScatterChart>
      </div>
    );
  }
}

export default App;
