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
    // Initialize other pieces...
    result[0][0] = result[0][7] = { type: 'Brook', x: 0, y: 0 };
    result[7][0] = result[7][7] = { type: 'Wrook', x: 7, y: 0 };
    result[0][1] = result[0][6] = { type: 'Bknight', x: 0, y: 1 };
    result[7][1] = result[7][6] = { type: 'Wknight', x: 7, y: 1 };
    result[0][2] = result[0][5] = { type: 'Bbishop', x: 0, y: 2 };
    result[7][2] = result[7][5] = { type: 'Wbishop', x: 7, y: 2 };
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
      setSelectedPiece({ x, y, ...chessBoard[x][y] });
    }
  };

  const movePiece = (x, y) => {
    if (isMoveValid(selectedPiece, x, y)) {
      const newBoard = chessBoard.map(row => row.slice());
      const { x: oldX, y: oldY } = selectedPiece;
      newBoard[x][y] = { ...selectedPiece, x, y };
      newBoard[oldX][oldY] = null;
      setChessBoard(newBoard);
    }
    setSelectedPiece(null);
  };

  const isMoveValid = (piece, x, y) => {
    
  
     if(piece.type === 'Bpawn' && x === piece.x + 2 && y ===piece.y && chessBoard[x][y]==null && piece.x===1)
     {
        return true;
     }
    
     if(piece.type === 'Wpawn' && x === piece.x -2 && y ===piece.y && chessBoard[x][y]==null && piece.x===6)
     {
        return true;
     }
    
    if (piece.type === 'Bpawn' && x === piece.x + 1 && y === piece.y && chessBoard[x][y]==null )  {
     
      return true;
    }
    if (piece.type === 'Wpawn' && x === piece.x - 1 && y === piece.y && chessBoard[x][y]==null ) {
      return true;
    }

    if(piece.type==='Wpawn' && ((x === piece.x - 1 && y === piece.y+1)||(x === piece.x - 1 && y === piece.y-1)) && chessBoard[x][y]!=null && chessBoard[x][y].type[0]==='B')
    {
      return true;
    }
    if(piece.type==='Bpawn' && ((x === piece.x + 1 && y === piece.y+1)||(x === piece.x + 1 && y === piece.y-1)) && chessBoard[x][y]!=null && chessBoard[x][y].type[0]==='W')
    {
      return true;
    }
    
  
    
    return false;
  };

  const renderPiece = (piece, x, y) => {
    if (!piece) return null;
    const PieceComponent = {
      Bpawn, Wpawn, Brook, Wrook, Bbishop, Wbishop, Bknight, Wknight, Wqueen, Bqueen, Wking, Bking
    }[piece.type];
    return <PieceComponent x={x} y={y}  onClick={handlePieceClick} />;
  };

  return (
    <>
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
                    } `}
                    key={cIndex}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                      width: '80px',
                    }}
                    onClick={() => handlePieceClick(rIndex, cIndex)}
                  >
                    
                    {renderPiece(piece, rIndex, cIndex,)}
                  </div>
                );
              })}
            </div>
          );
        })}
    </>
  );
}
