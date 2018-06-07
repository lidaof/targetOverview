import React, { Component } from 'react';
import './App.css';
import {
  BarChart, Bar, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Brush, PieChart, Pie, Sector
} from "recharts";
import axios from 'axios';
//import myData from './atac_summary.json';
//
//console.log(myData);
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

const colors = {
  'Bartolomei Lab':'#e41a1c',
  'Biswal Lab':'#377eb8',
  'Dolinoy Lab':'#4daf4a',
  'Mutlu Lab': '#984ea3',
  'Zhibin Lab': '#ff7f00',
  'Aylor Lab': '#e7298a'
};

const ATAC_SUMMARY = 'https://target.wustl.edu/dli/data_summary/atac_summary.json';

const columns = [{
  dataField: 'Lab',
  text: 'Lab',
  sort: true
}, {
  dataField: 'Count',
  text: 'Submitted datasets',
  sort: true
}, {
  dataField: 'Passed',
  text: 'Datasets passed QC',
  sort: true
}];

const defaultSorted = [{
  dataField: 'Passed',
  order: 'desc'
}];

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      myData: {},
      loading: true,
      error: null
    };
    this.renderTooltip = this.renderTooltip.bind(this);
  }

  componentDidMount(){
    axios.get(ATAC_SUMMARY)
      .then((response) => this.setState({
        myData: response.data, 
        loading: false,
        error: null
      })).catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
  }

  renderTooltip(props) {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div>
          <ul className="list-group text-left">
            <li className="list-group-item">Score: {data['score']}</li>
            <li className="list-group-item">Date: {data['Date']}</li>
            <li className="list-group-item">Lab: <span style={{color: colors[data['Lab']]}}>{data['Lab']}</span></li>
            <li className="list-group-item">Useful Single Ends: {data['Useful_single_ends']}</li>
            <li className="list-group-item">chrM rate: {data['chrM_rate']}</li>
            <li className="list-group-item">Raw reads duplication: {data['Raw_reads_duplication']}</li>
            <li className="list-group-item">Alignment PCR duplication: {data['Alignment_PCR_duplication']}</li>
            <li className="list-group-item">Reads% under peaks: {data['Reads_under_peaks']}</li>
            <li className="list-group-item">Enrichment in promoters: {data['Enrichment_in_promoters']}</li>
            <li className="list-group-item">Subsampled enrichment: {data['Subsampled_enrichment']}</li>
            <li className="list-group-item">Background: {data['Background']}</li>
          </ul>

        </div>
      );
    }

    return null;
  }

  renderSummary() {
    const { error, myData } = this.state;
    if(error) {
      return this.renderError();
    }
    //const tickCount = myData.dateLabel.length;

    return (

      <div className="App">
      <h1>Overview</h1>
      <p className="lead text-left">Total datasets: <span className="alert alert-primary">{myData.total}</span></p>
      <p></p>
      <PieChart width={800} height={400}>
        <Pie
          data={myData.countByLab} 
          nameKey="Lab"
          dataKey="Passed"
          cx={200} cy={200} outerRadius={60} fill="#8884d8"
          
        >
        	{
          	myData.countByLab.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Pie>
        <Pie
          data={myData.countByLab} 
          nameKey="Lab"
          dataKey="Count"
          cx={200} cy={200} innerRadius={90} outerRadius={110} fill="#82ca9d"
          label
        >
        	{
          	myData.countByLab.map((entry, index) => {
              return <Cell key={`cell2-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Pie>
        <Tooltip/>
      </PieChart>
      <div>
          <BootstrapTable
            keyField="Lab"
            data={ myData.countByLab }
            columns={ columns }
            defaultSorted={ defaultSorted } 
          />
      </div>
      <h1>Summary</h1>
      <BarChart width={1200} height={300} data={myData.count}
           syncId="myChart" margin={{top: 20, right: 20, left: 40, bottom: 20}}>
       <CartesianGrid strokeDasharray="3 3"/>
       <XAxis type="category" dataKey='Date' name='Date' />
       <YAxis/>
       <Tooltip/>
       <Legend />
       {
         Object.keys(colors).map((lab) => <Bar key={lab} dataKey={lab} stackId="a" fill={colors[lab]} />)
       }
       {/* <Bar dataKey="Bartolomei Lab" fill={colors['Bartolomei Lab']} />
       <Bar dataKey="Biswal Lab" fill={colors['Biswal Lab']} />
       <Bar dataKey="Dolinoy Lab" fill={colors['Dolinoy Lab']} />
       <Bar dataKey="Mutlu Lab" fill={colors['Mutlu Lab']} /> */}
      </BarChart>
      <h1>Useful Single Ends</h1>
      <ScatterChart width={1200} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
        <YAxis type="number" dataKey={'Useful_single_ends'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
        <Scatter name='Useful_single_ends' data={myData.data} syncId="myChart" fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
        <ReferenceLine y={myData.ref.map_good} label={`Good: ${Math.round(myData.ref.map_good)}`} stroke="darkgreen" />
        <ReferenceLine y={myData.ref.map_ok} label={`Acceptable: ${Math.round(myData.ref.map_ok)}`} stroke="red" />
      </ScatterChart>
      <h1>chrM Rate</h1>
        <ScatterChart width={1200} height={400} syncId="myChart" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
          {/* <XAxis type="number" dataKey='Date' name='Date' tickCount={tickCount} tickFormatter={(tick) => myData.dateLabel[tick] } /> */}
          <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
          <YAxis type="number" dataKey={'chrM_rate'} name='Number'/>
          <CartesianGrid />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
          <Scatter name='chrM_rate' data={myData.data} fill='#8884d8'>
            {
              myData.data.map((entry, index) => {
                return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
              })
            }
          </Scatter>
      </ScatterChart>
      <h1>Raw Reads Duplication</h1>
      <ScatterChart width={1200} height={400} syncId="myChart" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
        <YAxis type="number" dataKey={'Raw_reads_duplication'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
        <Scatter name='Raw_reads_duplication' data={myData.data} fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
      </ScatterChart>
      <h1>Alignment PCR Duplication</h1>
      <ScatterChart width={1200} height={400} syncId="myChart" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
        <YAxis type="number" dataKey={'Alignment_PCR_duplication'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
        <Scatter name='Alignment_PCR_duplication' data={myData.data} fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
        {/* <ReferenceLine y={myData.ref.dup_good} label={`Good: ${myData.ref.dup_good}`} stroke="darkgreen" />
        <ReferenceLine y={myData.ref.dup_ok} label={`Acceptable: ${myData.ref.dup_ok}`} stroke="red" /> */}
      </ScatterChart>
      <h1>Reads% Under Peaks</h1>
      <ScatterChart width={1200} height={400} syncId="myChart" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
        <YAxis type="number" dataKey={'Reads_under_peaks'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
        <Scatter name='Reads_under_peaks' data={myData.data} fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
        <ReferenceLine y={myData.ref.rup_good} label={`Good: ${myData.ref.rup_good}`} stroke="darkgreen" />
        <ReferenceLine y={myData.ref.rup_ok} label={`Acceptable: ${myData.ref.rup_ok}`} stroke="red" />
      </ScatterChart>
      <h1>Enrichment in Promoters</h1>
      <ScatterChart width={1200} height={400} syncId="myChart" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
        <YAxis type="number" dataKey={'Enrichment_in_promoters'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
        <Scatter name='Enrichment_in_promoters' data={myData.data} fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
        <ReferenceLine y={myData.ref.enr_p_good} label={`Good: ${myData.ref.enr_p_good}`} stroke="darkgreen" />
        <ReferenceLine y={myData.ref.enr_p_ok} label={`Acceptable: ${myData.ref.enr_p_ok}`} stroke="red" />
      </ScatterChart>
      <h1>Subsampled Enrichment</h1>
      <ScatterChart width={1200} height={400} syncId="myChart" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
        <YAxis type="number" dataKey={'Subsampled_enrichment'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
        <Scatter name='Subsampled_enrichment' data={myData.data} fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
        <ReferenceLine y={myData.ref.enr_s_good} label={`Good: ${myData.ref.enr_s_good}`} stroke="darkgreen" />
        <ReferenceLine y={myData.ref.enr_s_ok} label={`Acceptable: ${myData.ref.enr_s_ok}`} stroke="red" />
      </ScatterChart>
      <h1>Background</h1>
      <ScatterChart width={1200} height={400} syncId="myChart" margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <XAxis type="category" dataKey='Date' name='Date' allowDuplicatedCategory={false} />
        <YAxis type="number" dataKey={'Background'} name='Number'/>
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
        <Scatter name='Background' data={myData.data} fill='#8884d8'>
          {
            myData.data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[entry.Lab]} />
            })
          }
        </Scatter>
        <ReferenceLine y={myData.ref.bk_good} label={`Good: ${myData.ref.bk_good}`} stroke="darkgreen" />
        <ReferenceLine y={myData.ref.bk_ok} label={`Acceptable: ${myData.ref.bk_ok}`} stroke="red" />
      </ScatterChart>
      <hr/>
      <p className="text-primary text-left font-italic">Last Update: {myData.lastupdate}</p>
      </div>
    );
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        {loading ? this.renderLoading() : this.renderSummary()}
      </div>
    );
  }
}

export default App;
