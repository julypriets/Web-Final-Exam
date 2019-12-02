import React, { Component } from "react";
import "../App.css";
import { Container, Table, Row, Col } from "react-bootstrap";
import * as d3 from "d3";
import Moment from "react-moment";

import Movie from "./Movie";

class MovieList extends Component {
  state = {
    movies: [],
    currentMovie: {
      poster: "",
      name: "",
      description: "",
      cast: ""
    },
    data: [],
    showMovie: { display: "none" },
    language: navigator.language
  };

  constructor(props) {
    super(props);
    this.fetchInfo();
  }

  fetchInfo() {
    const url = this.getUrl();
    fetch(url)
      .then(response => response.json())
      .then(jsonData => {
        // jsonData is parsed json object received from url
        console.log(jsonData);

        //Cambio el estado de la aplicación
        this.setState({
          movies: jsonData
        });
        this.renderCanvas();
      })
      .catch(error => {
        // handle your errors here
        console.error(error);
      });
  }

  getUrl() {
    if (this.state.language.includes("es")) {
      return "https://gist.githubusercontent.com/josejbocanegra/f784b189117d214578ac2358eb0a01d7/raw/2b22960c3f203bdf4fac44cc7e3849689218b8c0/data-es.json";
    } else {
      return "https://gist.githubusercontent.com/josejbocanegra/8b436480129d2cb8d81196050d485c56/raw/48cc65480675bf8b144d89ecb8bcd663b05e1db0/data-en.json";
    }
  }

  movieDetail(item) {
    this.setState({
      currentMovie: {
        poster: item.poster,
        name: item.name,
        description: item.description,
        cast: item.cast
      },
      showMovie: { display: "block" }
    });
  }

  getData() {
    let obj = [];
    for (let i = 0; i < this.state.movies.length; i++) {
      var item = this.state.movies[i];
      obj.push({ id: item.id, views: item.views });
    }
    this.setState({ data: obj });
  }

  renderCanvas() {
    const canvas = d3.select("#canvas");
    this.getData();
    const data = this.state.data;

    const width = 700;
    const height = 500;
    const margin = { top: 10, left: 70, bottom: 40, right: 10 };
    const iwidth = width - margin.left - margin.right;
    const iheight = height - margin.top - margin.bottom;

    const svg = canvas.append("svg");
    svg.attr("width", width);
    svg.attr("height", height);

    let g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleLinear()
      .domain([0, 9500000])
      .range([iheight, 0]);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.id))
      .range([0, iwidth])
      .padding(0.1);

    const bars = g.selectAll("rect").data(data);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .style("fill", "grey")
      .attr("x", d => x(d.id))
      .attr("y", d => y(d.views))
      .attr("height", d => iheight - y(d.views))
      .attr("width", x.bandwidth());

    g.append("g")
      .classed("x--axis", true)
      .call(d3.axisBottom(x))
      .attr("transform", `translate(0, ${iheight})`);

    g.append("g")
      .classed("y--axis", true)
      .call(d3.axisLeft(y));
  }

  getMillions(number) {
    if (this.state.language.includes("es")) {
      //Español
      if (number === 1) {
        return "millón";
      } else {
        return "millones";
      }
    } else {
      //Inglés
      if (number === 1) {
        return "million";
      } else {
        return "millions";
      }
    }
  }

  numberWithCommas(x) {
    if (this.state.language.includes("es")) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }

  locale() {
    if (this.state.language.includes("es")) {
      return "es"
    } else {
        return "en"
    }
  }

  render() {
    const moviesList = this.state.movies.map((item, index) => {
      const millions = this.getMillions(item.budget);
      const dateToFormat = new Date(item.releaseDate);

      return (
        <tr key={index} onClick={() => this.movieDetail(item)}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.directedBy}</td>
          <td>{item.country}</td>
          <td>
            {item.budget} {millions}
          </td>
          <td>
            <Moment
              date={dateToFormat}
              format="DD/MMMM/YYYY"
              locale={this.locale()}
            />
          </td>
          <td>{this.numberWithCommas(item.views)}</td>
        </tr>
      );
    });

    return (
      <div className="App">
        <div className="title">Movies</div>
        <Container>
          <Row>
            <Col lg="7" md="7" sm="12">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Directed by</th>
                    <th>Country</th>
                    <th>Budget</th>
                    <th>Release</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>{moviesList}</tbody>
              </Table>
            </Col>
            <Col lg="5" md="5" sm="12">
              <Movie
                poster={this.state.currentMovie.poster}
                name={this.state.currentMovie.name}
                description={this.state.currentMovie.description}
                cast={this.state.currentMovie.cast}
                style={this.state.showMovie}
              />
            </Col>
          </Row>
          <div id="canvas"></div>
        </Container>
      </div>
    );
  }
}

export default MovieList;
