import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

/** TODO
 * 1) Display the location for each move in the format (col, row) in the move history list.
 *  Bold the currently selected item in the move list.
 *  Rewrite Board to use two loops to make the squares instead of hardcoding them.
 * 4) Add a toggle button that lets you sort the moves in either ascending or descending order.
 *  When someone wins, highlight the three squares that caused the win.
 *  When no one wins, display a message about the result being a draw.
 */

function Square(props) {
  return (
    <button
      style={{
        //When someone wins, highlight the three squares that caused the win
        color: props.hl ? "blue" : "black"
      }}
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, highlight) {
    console.log(this.props);
    return (
      <Square
        key={i}
        hl={highlight}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createTable = () => {
    //Rewrite Board to use two loops to make the squares instead of hardcoding them
    let sq = 0;
    const table = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(sq++, this.props.winner.includes(sq - 1)));
      }
      table.push(
        <div className="board-row" key={i}>
          {row}
        </div>
      );
    }
    return table;
  };

  render() {
    return <div>{this.createTable()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          stepCoords: Array(2).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,

      winnerCombination: "",
      isSelected: null //bold if selected
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  onClickItem(item) {
    this.setState({
      isSelected: item
    });
    return this;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move # ${move}` : "Go to game start";
      return (
        <li key={move}>
          <button
            style={{
              //Bold the currently selected item in the move list
              fontWeight: this.state.isSelected === move ? "bold" : "normal"
            }}
            onClick={() => {
              this.onClickItem(move).jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
      this.state.winnerCombination = winner;
    } else {
      //When no one wins, display a message about the result being a draw
      status =
        this.state.stepNumber === 9
          ? "Draw"
          : `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={this.state.winnerCombination}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
