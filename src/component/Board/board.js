import React, { useEffect, useState } from 'react';
import Bpawn from './Chess-pieces/black/Bpawn';
import Wpawn from './Chess-pieces/white/Wpawn';
import Brook from './Chess-pieces/black/Brook';
import Wrook from './Chess-pieces/white/Wrook';
import Bbishop from './Chess-pieces/black/Bbishop';
import Wbishop from './Chess-pieces/white/Wbishop';
import Bknight from './Chess-pieces/black/Bknight';
import Wknight from './Chess-pieces/white/Wknight';
import Wqueen from './Chess-pieces/white/Wqueen';
import Bqueen from './Chess-pieces/black/Bqueen';
import Wking from './Chess-pieces/white/Wking';
import Bking from './Chess-pieces/black/Bking';

export default function Board() {
  const n = 8;
  const m = 8;
  
  const [chessBoard, setChessBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [player , setplayer] = useState("W");
  useEffect(() => {
    const result = [];
    for (let i = 0; i < n; i++) {
      const row = Array.from({ length: m }, () => null);
      result.push(row);
    }
    // Initialize pawns
    for (let i = 0; i < m; i++) {
      result[1][i] = { type: 'Bpawn', x: 1, y: i };
      result[6][i] = { type: 'Wpawn', x: 6, y: i };
    }
    // Initialize rooks
    result[0][0] = { type: 'Brook', x: 0, y: 0 };
    result[0][7] = { type: 'Brook', x: 0, y: 7 };
    result[7][0] = { type: 'Wrook', x: 7, y: 0 };
    result[7][7] = { type: 'Wrook', x: 7, y: 7 };
    // Initialize other pieces
    result[0][1] = { type: 'Bknight', x: 0, y: 1 };
    result[0][6] = { type: 'Bknight', x: 0, y: 6 };
    result[7][1] = { type: 'Wknight', x: 7, y: 1 };
    result[7][6] = { type: 'Wknight', x: 7, y: 6 };
    
    result[0][2] = { type: 'Bbishop', x: 0, y: 2 };
    result[0][5] = { type: 'Bbishop', x: 0, y: 5 };
    result[7][2] = { type: 'Wbishop', x: 7, y: 2 };
    result[7][5] = { type: 'Wbishop', x: 7, y: 5 };
    
    result[0][3] = { type: 'Bqueen', x: 0, y: 3 };
    result[0][4] = { type: 'Bking', x: 0, y: 4 };
    result[7][3] = { type: 'Wqueen', x: 7, y: 3 };
    result[7][4] = { type: 'Wking', x: 7, y: 4 };
  
    setChessBoard(result);
  }, []);
  
  const handlePieceClick = (x, y) => {
    if (selectedPiece) {
      movePiece(x, y);
      
     
    } else if (chessBoard[x][y]) {
      const piece = chessBoard[x][y];
      setSelectedPiece({ x, y, ...piece });
      setValidMoves(calculateValidMoves(piece));
    }
  };

  const movePiece = (x, y) => {
   
    if(player==selectedPiece.type[0])
    if (isMoveValid(selectedPiece, x, y)) {
      const newBoard = chessBoard.map(row => row.slice());
      const { x: oldX, y: oldY } = selectedPiece;
      newBoard[x][y] = { ...selectedPiece, x, y };
      newBoard[oldX][oldY] = null;
      setChessBoard(newBoard);
      setValidMoves([]);
      setplayer(player==="W"?"B":"W");
      
    }
    setSelectedPiece(null);
  };

  const isMoveValid = (piece, x, y) => {
    if (x < 0 || x >= n || y < 0 || y >= m) {
      return false;
    }
    // Pawn movement
    if (piece.type === 'Bpawn' && x === piece.x + 2 && y === piece.y && chessBoard[x][y] === null && piece.x === 1) {
      return true;
    }
    if (piece.type === 'Wpawn' && x === piece.x - 2 && y === piece.y && chessBoard[x][y] === null && piece.x === 6) {
      return true;
    }
    if (piece.type === 'Bpawn' && x === piece.x + 1 && y === piece.y && chessBoard[x][y] === null) {
      return true;
    }
    if (piece.type === 'Wpawn' && x === piece.x - 1 && y === piece.y && chessBoard[x][y] === null) {
      return true;
    }
    if (piece.type === 'Wpawn' && ((x === piece.x - 1 && y === piece.y + 1) || (x === piece.x - 1 && y === piece.y - 1)) && chessBoard[x][y] !== null && chessBoard[x][y].type[0] === 'B') {
      return true;
    }
    if (piece.type === 'Bpawn' && ((x === piece.x + 1 && y === piece.y + 1) || (x === piece.x + 1 && y === piece.y - 1)) && chessBoard[x][y] !== null && chessBoard[x][y].type[0] === 'W') {
      return true;
    }
  
    // Rook movement
    if ((piece.type === 'Brook' || piece.type === 'Wrook' || piece.type === 'Bqueen' || piece.type === 'Wqueen') && (x === piece.x || y === piece.y)) {
      const [start, end] = x === piece.x ? [Math.min(y, piece.y), Math.max(y, piece.y)] : [Math.min(x, piece.x), Math.max(x, piece.x)];
      for (let i = start + 1; i < end; i++) {
        if (chessBoard[x === piece.x ? piece.x : i][x === piece.x ? i : piece.y] !== null) {
          return false;
        }
      }
      if (chessBoard[x][y] === null || chessBoard[x][y].type[0] !== piece.type[0]) {
        return true;
      }
    }
  
    // Bishop movement
    if ((piece.type === 'Bbishop' || piece.type === 'Wbishop' || piece.type === 'Bqueen' || piece.type === 'Wqueen') && Math.abs(x - piece.x) === Math.abs(y - piece.y)) {
      const deltaX = x > piece.x ? 1 : -1;
      const deltaY = y > piece.y ? 1 : -1;
      let currentX = piece.x + deltaX;
      let currentY = piece.y + deltaY;
      while (currentX !== x && currentY !== y) {
        if (currentX < 0 || currentX >= n || currentY < 0 || currentY >= m) {
          return false;
        }
        if (chessBoard[currentX][currentY] !== null) {
          return false;
        }
        currentX += deltaX;
        currentY += deltaY;
      }
      // Ensure target square is either empty or occupied by an opponent's piece
      if (chessBoard[x][y] === null || chessBoard[x][y].type[0] !== piece.type[0]) {
        return true;
      }
    }
  
    // King movement
    if ((piece.type === 'Bking' || piece.type === 'Wking') && Math.abs(x - piece.x) <= 1 && Math.abs(y - piece.y) <= 1) {
      // Ensure target square is either empty or occupied by an opponent's piece
      if (chessBoard[x][y] === null || chessBoard[x][y].type[0] !== piece.type[0]) {
        return true;
      }
    }
  
    // Knight movement
    if (piece.type === 'Bknight' || piece.type === 'Wknight') {
      const dx = Math.abs(x - piece.x);
      const dy = Math.abs(y - piece.y);
      if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
        // Ensure target square is either empty or occupied by an opponent's piece
        if (chessBoard[x][y] === null || chessBoard[x][y].type[0] !== piece.type[0]) {
          return true;
        }
      }
    }
  
    return false;
  };
  
  const calculateValidMoves = (piece) => {
    const moves = [];
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < m; y++) {
        if (isMoveValid(piece, x, y)) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  };
  
  

  const renderPiece = (piece, x, y) => {
    if (!piece) return null;
    const PieceComponent = {
      Bpawn, Wpawn, Brook, Wrook, Bbishop, Wbishop, Bknight, Wknight, Wqueen, Bqueen, Wking, Bking
    }[piece.type];
    return <PieceComponent  x={x} y={y} onClick={() => handlePieceClick(x, y)} />;
  };

  const isHighlight = (x, y) => validMoves.some(move => move.x === x && move.y === y);
  return (
    <div style={{display:'flex',width:'70%'}}>
      <div>
      {chessBoard.length > 0 &&
        chessBoard.map((row, rIndex) => {
          return (
            <div className="row" key={rIndex}>
              {row.map((piece, cIndex) => {
                return (
                  <div
                    className={`box ${
                      (rIndex + cIndex) % 2 === 0
                        ? `black ${rIndex}${cIndex}`
                        : `white ${rIndex}${cIndex}`
                    } ${isHighlight(rIndex,cIndex)?chessBoard[rIndex][cIndex]!=null?"highlighted-takes":"highlighted":""}`}
                    key={cIndex}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 'calc(100vw / 8)', // Set height based on viewport width
                      width: 'calc(100vw / 8)',  // Set width based on viewport width
                      maxWidth: '80px',          // Limit maximum width to 80px
                      maxHeight: '80px',   
                        // Limit maximum height to 80px
                    }}
                    onClick={() => handlePieceClick(rIndex, cIndex)}
                  >
                    {renderPiece(piece, rIndex, cIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
        </div>
        <div style={{alignContent:"center",paddingLeft:"2%",width:"100%"}}>
        <h1>Player-{player}</h1>
        </div>
        
        
    </div>
  );
}
