import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ color: props.inWin ? "#dc3545" : "#000" }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        key={j}
        inWin={this.props.winnerLine?.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    //5x5
    const size = 5;

    //3x3
    // const size = 3;
    let squares = [];
    for (let i = 0; i < size; ++i) {
      let row = [];
      for (let j = 0; j < size; ++j) {
        row.push(this.renderSquare(i * size + j, j));
      }
      squares.push(row);
    }

    return (
      <div>
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
        {squares.map((item, index) => (
          <div key={index} className="board-row">
            {item}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          //3x3
          // squares: Array(9).fill(null),

          //5x5
          squares: Array(25).fill(null),
          position: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescending: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //5x5
    if (calculateWinnerFor5x5(squares) || squares[i]) {
      return;
    }

    //3x3
    // if (calculateWinner(squares) || squares[i]) {
    //   return;
    // }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isEnd: false,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleReverseMove() {
    this.setState({
      isDescending: !this.state.isDescending,
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    //5x5
    const winner = calculateWinnerFor5x5(current.squares);

    //3x3

    // const winner = calculateWinner(current.squares);

    if (this.state.isDescending) {
      history = history.slice().reverse();
    }
    const moves = history.map((step, move) => {
      if (this.state.isDescending) {
        move = history.length - move - 1;
      }
      const desc = move
        ? "Go to move #" +
          move +
          " (" +
          Math.floor(step.position / 3) +
          "," +
          (step.position % 3) +
          ")"
        : "Go to game start";

      return (
        <li key={move} style={{ marginTop: "4px" }}>
          <button
            style={{
              backgroundColor:
                move === this.state.stepNumber ? "#6f42c1" : "#ccc",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      console.log(current.squares);
      if (!current.squares.includes(null)) {
        status = "DRAW. No winner";
        // this.setState({ isEnd: true });
      } else {
        // this.setState({ isEnd: true });
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerLine={winner ? winner.line : null}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-info__header">
            <div>{status}</div>
            <button
              onClick={() => this.handleReverseMove()}
              style={{
                backgroundColor: "#198754",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px",
                border: "none",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Toggle sort
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

function calculateWinnerFor5x5(squares) {
  const size = 5;
  let mainDiagonal = 0; //duong cheo chinh
  let auxDiagonal = 0; // duong cheo phu
  // for (let i = 0; i < lines.length; i++) {
  //   const [a, b, c] = lines[i];
  //   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
  //     return { winner: squares[a], line: lines[i] };
  //   }
  // }
  console.log("squares", squares);
  for (let i = 0; i < size; i++) {
    let flag = 0;
    let flagY = 0;
    for (let j = 0; j < size; j++) {
      // console.log(squares[i * size + j]);

      //win ngang
      if (squares[i * size + j] === "X") {
        flag += 1;
      } else if (squares[i * size + j] === "O") {
        flag -= 1;
      }
      //win doc
      if (squares[i + j * size] === "X") {
        flagY += 1;
      } else if (squares[i + j * size] === "O") {
        flagY -= 1;
      }

      //2 duong cheo
      const pos = i * size + j;
      if (pos % size === Math.floor(pos / size)) {
        if (squares[pos] === "X") mainDiagonal += 1;
        else if (squares[pos] === "O") mainDiagonal -= 1;
      }

      if (pos % (size - 1) === 0) {
        if (squares[pos] === "X") auxDiagonal += 1;
        else if (squares[pos] === "O") auxDiagonal -= 1;
      }
    }
    if (flagY === -size || flagY === size) {
      let line = [];
      for (let index = 0; index < size; index++) {
        line.push(i + index * size);
      }
      if (flagY === -size) {
        return { winner: "O", line: line };
      } else if (flagY === size) {
        return { winner: "X", line: line };
      }
    }
    if (flag === -size || flag === size) {
      let line = [];
      for (let index = 0; index < size; index++) {
        line.push(i * size + index);
      }
      console.log("line", line);
      console.log("i", i);
      if (flag === size) {
        return { winner: "X", line: line };
      } else if (flag === -size) {
        return { winner: "O", line: line };
      }
    }
  }
  if (mainDiagonal === -size || mainDiagonal === size) {
    const line = [0, 6, 12, 18, 24];
    if (mainDiagonal === -size) {
      return { winner: "O", line: line };
    } else if (mainDiagonal === size) {
      return { winner: "X", line: line };
    }
  }

  if (auxDiagonal === -size || auxDiagonal === size) {
    const line = [4, 8, 12, 16, 20];
    if (auxDiagonal === -size) {
      return { winner: "O", line: line };
    } else if (auxDiagonal === size) {
      return { winner: "X", line: line };
    }
  }

  return null;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
