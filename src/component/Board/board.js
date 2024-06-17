import React, { useEffect, useState } from "react";
import { Bpawn, Bpawnmoved } from "./Chess-pieces/black/Bpawn";
import { Wpawn, Wpawnmoved } from "./Chess-pieces/white/Wpawn";
import { Brook, Brookmoved } from "./Chess-pieces/black/Brook";
import { Wrook, Wrookmoved } from "./Chess-pieces/white/Wrook";
import Bbishop from "./Chess-pieces/black/Bbishop";
import Wbishop from "./Chess-pieces/white/Wbishop";
import Bknight from "./Chess-pieces/black/Bknight";
import Wknight from "./Chess-pieces/white/Wknight";
import Wqueen from "./Chess-pieces/white/Wqueen";
import Bqueen from "./Chess-pieces/black/Bqueen";
import { Wking, Wkingmoved } from "./Chess-pieces/white/Wking";
import { Bking, Bkingmoved } from "./Chess-pieces/black/Bking";
import socket from "../../socket";
export default function Board(props) {
  const n = 8;
  const m = 8;
 
  const [chessBoard, setChessBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [player, setplayer] = useState("W");
  const [show, setshow] = useState(null);
  const [final, setfinal] = useState(0);







  useEffect(() => {
    const result = [];
    for (let i = 0; i < n; i++) {
      const row = Array.from({ length: m }, () => null);
      result.push(row);
    }
    // Initialize pawns
    for (let i = 0; i < m; i++) {
      result[1][i] = { type: "Bpawn", x: 1, y: i };
      result[6][i] = { type: "Wpawn", x: 6, y: i };
    }
    // Initialize rooks
    result[0][0] = { type: "Brook", x: 0, y: 0 };
    result[0][7] = { type: "Brook", x: 0, y: 7 };
    result[7][0] = { type: "Wrook", x: 7, y: 0 };
    result[7][7] = { type: "Wrook", x: 7, y: 7 };
    // Initialize other pieces
    result[0][1] = { type: "Bknight", x: 0, y: 1 };
    result[0][6] = { type: "Bknight", x: 0, y: 6 };
    result[7][1] = { type: "Wknight", x: 7, y: 1 };
    result[7][6] = { type: "Wknight", x: 7, y: 6 };

    result[0][2] = { type: "Bbishop", x: 0, y: 2 };
    result[0][5] = { type: "Bbishop", x: 0, y: 5 };
    result[7][2] = { type: "Wbishop", x: 7, y: 2 };
    result[7][5] = { type: "Wbishop", x: 7, y: 5 };

    result[0][3] = { type: "Bqueen", x: 0, y: 3 };
    result[0][4] = { type: "Bking", x: 0, y: 4 };
    result[7][3] = { type: "Wqueen", x: 7, y: 3 };
    result[7][4] = { type: "Wking", x: 7, y: 4 };

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
  const handlePieceDragOver = (event) => {
    event.preventDefault(); // Prevent the default behavior (preventing the drop)
  };

  const movePiece = (x, y) => {
    if (
      (player === 'B' && props.players === 0 && selectedPiece.type[0] === 'B') ||
      (player === 'W' && props.players > 0 && selectedPiece.type[0] === 'W')
    ) {
      if (isMoveValid(selectedPiece, x, y, chessBoard)) {
        // Create a new Audio object
        var audio = new Audio(
          `https://images.chesscomfiles.com/chess-themes/sounds/_WEBM_/default/${
            chessBoard[x][y] === null ? "move-self" : "capture"
          }.webm`
        );
        // Play the audio
        audio.play();

        const newBoard = chessBoard.map((row) => row.slice());
        const { x: oldX, y: oldY } = selectedPiece;
        console.log(selectedPiece);
        if (
          selectedPiece.type === "Wking" &&
          x === 7 &&
          y === 6 &&
          selectedPiece.x === 7 &&
          selectedPiece.y === 4 &&
          chessBoard[7][7] &&
          chessBoard[7][7].type === "Wrook"
        ) {
          const newBoard = chessBoard.map((row) => row.slice());
          if (selectedPiece.type === "Bking") selectedPiece.type = "Bkingmoved";

          if (selectedPiece.type === "Wking") selectedPiece.type = "Wkingmoved";

          if (selectedPiece.type === "Brook") selectedPiece.type = "Brookmoved";

          if (selectedPiece.type === "Wrook") selectedPiece.type = "Wrookmoved";
          newBoard[7][6] = { ...selectedPiece, x: 7, y: 6 };
          newBoard[7][5] = { ...chessBoard[7][7], x: 7, y: 5 };
          newBoard[7][7] = null;
          newBoard[selectedPiece.x][selectedPiece.y] = null;
          setChessBoard(newBoard);
          setValidMoves([]);
          setplayer(player === "W" ? "B" : "W");
          setSelectedPiece(null);
          if (chessBoard.length>0) {
            console.log(props.room)
        socket.emit('move', {roomId:props.room, move: newBoard ,player:(player==='W')?'B':'W'});
           
          }
          return;
        }
        if (
          selectedPiece.type === "Wking" &&
          x === 7 &&
          y === 2 &&
          selectedPiece.x === 7 &&
          selectedPiece.y === 4 &&
          chessBoard[7][0] &&
          chessBoard[7][0].type === "Wrook"
        ) {
          const newBoard = chessBoard.map((row) => row.slice());
          if (selectedPiece.type === "Bking") selectedPiece.type = "Bkingmoved";

          if (selectedPiece.type === "Wking") selectedPiece.type = "Wkingmoved";

          if (selectedPiece.type === "Brook") selectedPiece.type = "Brookmoved";

          if (selectedPiece.type === "Wrook") selectedPiece.type = "Wrookmoved";
          newBoard[7][2] = { ...selectedPiece, x: 7, y: 2 };
          newBoard[7][3] = { ...chessBoard[7][0], x: 7, y: 3 };
          newBoard[7][0] = null;
          newBoard[selectedPiece.x][selectedPiece.y] = null;
          setChessBoard(newBoard);
          setValidMoves([]);
          setplayer(player === "W" ? "B" : "W");
          setSelectedPiece(null);
          if (chessBoard.length>0) {
            console.log(props.room)
        socket.emit('move', {roomId:props.room, move: newBoard ,player:(player==='W')?'B':'W'});
           
          }
          return;
        }
        if (
          selectedPiece.type === "Bking" &&
          x === 0 &&
          y === 6 &&
          selectedPiece.x === 0 &&
          selectedPiece.y === 4 &&
          chessBoard[0][7] &&
          chessBoard[0][7].type === "Brook"
        ) {
          const newBoard = chessBoard.map((row) => row.slice());
          if (selectedPiece.type === "Bking") selectedPiece.type = "Bkingmoved";

          if (selectedPiece.type === "Wking") selectedPiece.type = "Wkingmoved";

          if (selectedPiece.type === "Brook") selectedPiece.type = "Brookmoved";

          if (selectedPiece.type === "Wrook") selectedPiece.type = "Wrookmoved";
          newBoard[0][6] = { ...selectedPiece, x: 0, y: 6 };
          newBoard[0][5] = { ...chessBoard[0][7], x: 0, y: 5 };
          newBoard[0][7] = null;
          newBoard[selectedPiece.x][selectedPiece.y] = null;
          setChessBoard(newBoard);
          setValidMoves([]);
          setplayer(player === "W" ? "B" : "W");
          setSelectedPiece(null);
          return;
        }
        if (
          selectedPiece.type === "Bking" &&
          x === 0 &&
          y === 2 &&
          selectedPiece.x === 0 &&
          selectedPiece.y === 4 &&
          chessBoard[0][0] &&
          chessBoard[0][0].type === "Brook"
        ) {
          const newBoard = chessBoard.map((row) => row.slice());
          if (selectedPiece.type === "Bking") selectedPiece.type = "Bkingmoved";

          if (selectedPiece.type === "Wking") selectedPiece.type = "Wkingmoved";

          if (selectedPiece.type === "Brook") selectedPiece.type = "Brookmoved";

          if (selectedPiece.type === "Wrook") selectedPiece.type = "Wrookmoved";
          newBoard[0][2] = { ...selectedPiece, x: 0, y: 2 };
          newBoard[0][3] = { ...chessBoard[0][0], x: 0, y: 3 };
          newBoard[0][0] = null;
          newBoard[selectedPiece.x][selectedPiece.y] = null;
          setChessBoard(newBoard);
          setValidMoves([]);
          setplayer(player === "W" ? "B" : "W");

          setSelectedPiece(null);
          if (chessBoard.length>0) {
            console.log(props.room)
        socket.emit('move', {roomId:props.room, move: newBoard ,player:(player==='W')?'B':'W'});
           
          }
          return;
        }

        if (selectedPiece.type === "Bking") selectedPiece.type = "Bkingmoved";

        if (selectedPiece.type === "Wking") selectedPiece.type = "Wkingmoved";

        if (selectedPiece.type === "Brook") selectedPiece.type = "Brookmoved";

        if (selectedPiece.type === "Wrook") selectedPiece.type = "Wrookmoved";
        newBoard[x][y] = { ...selectedPiece, x, y };
        newBoard[oldX][oldY] = null;
        let kingType = player === "W" ? "Wking" : "Bking";

        let kingPosition = findKingPosition(kingType, newBoard);
        if (kingPosition === null) {
          kingType = player === "W" ? "Wkingmoved" : "Bkingmoved";

          kingPosition = findKingPosition(kingType, newBoard);
        }
        console.log(kingPosition);
        const isUnderAttack = isselfKingInCheck(
          kingType,
          kingPosition.x,
          kingPosition.y,
          newBoard
        );

        if (!isUnderAttack) {
          if (selectedPiece.type === "Bpawn" && x === 7) {
            setshow({ x, y });
          }
          if (selectedPiece.type === "Wpawn" && x === 0) {
            setshow({ x, y });
          }

          setChessBoard(newBoard);
          setValidMoves([]);
          setplayer(player === "W" ? "B" : "W");
          if (chessBoard.length>0) {
            console.log(props.room)
        socket.emit('move', {roomId:props.room, move: newBoard ,player:(player==='W')?'B':'W'});
           
          }
        } else {
          var audioillegal = new Audio(
            `https://images.chesscomfiles.com/chess-themes/sounds/_WEBM_/default/illegal.webm`
          );
          // Play the audio
          audioillegal.play();
        }
      }
      setSelectedPiece(null);
    } else {
      console.log(selectedPiece);
      setSelectedPiece(null);
    }
  };

  const isKingInCheck = (kingType, kingX, kingY) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        const piece = chessBoard[i][j];
        if (
          piece &&
          piece.type[0] !== kingType[0] &&
          isMoveValid(piece, kingX, kingY, chessBoard)
        ) {
          console.log(piece);
          return true;
        }
      }
    }
    return false;
  };

  const isselfKingInCheck = (kingType, kingX, kingY, board) => {
    const n = board.length;
    const m = board[0].length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        const piece = board[i][j];
        if (
          piece &&
          piece.type[0] !== kingType[0] &&
          isMoveValid(piece, kingX, kingY, board)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const findKingPosition = (type, board) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (board[i][j] && board[i][j].type === type) {
          return { x: i, y: j };
        }
      }
    }
    return null; // King not found
  };

  // Usage example

  const isMoveValid = (piece, x, y, chessBoard) => {
    if (x < 0 || x >= n || y < 0 || y >= m) {
      return false;
    }
    // Pawn movement

    if (
      piece.type === "Bpawn" &&
      x === piece.x + 2 &&
      y === piece.y &&
      chessBoard[x][y] === null &&
      piece.x === 1
    ) {
      return true;
    }
    if (
      piece.type === "Wpawn" &&
      x === piece.x - 2 &&
      y === piece.y &&
      chessBoard[x][y] === null &&
      piece.x === 6
    ) {
      return true;
    }
    if (
      piece.type === "Bpawn" &&
      x === piece.x + 1 &&
      y === piece.y &&
      chessBoard[x][y] === null
    ) {
      return true;
    }
    if (
      piece.type === "Wpawn" &&
      x === piece.x - 1 &&
      y === piece.y &&
      chessBoard[x][y] === null
    ) {
      return true;
    }
    if (
      piece.type === "Wpawn" &&
      ((x === piece.x - 1 && y === piece.y + 1) ||
        (x === piece.x - 1 && y === piece.y - 1)) &&
      chessBoard[x][y] !== null &&
      chessBoard[x][y].type[0] === "B"
    ) {
      return true;
    }
    if (
      piece.type === "Bpawn" &&
      ((x === piece.x + 1 && y === piece.y + 1) ||
        (x === piece.x + 1 && y === piece.y - 1)) &&
      chessBoard[x][y] !== null &&
      chessBoard[x][y].type[0] === "W"
    ) {
      return true;
    }

    // Rook movement
    if (
      (piece.type === "Brook" ||
        piece.type === "Wrook" ||
        piece.type === "Bqueen" ||
        piece.type === "Wqueen" ||
        piece.type === "Brookmoved" ||
        piece.type === "Wrookmoved") &&
      (x === piece.x || y === piece.y)
    ) {
      const [start, end] =
        x === piece.x
          ? [Math.min(y, piece.y), Math.max(y, piece.y)]
          : [Math.min(x, piece.x), Math.max(x, piece.x)];
      for (let i = start + 1; i < end; i++) {
        if (
          chessBoard[x === piece.x ? piece.x : i][
            x === piece.x ? i : piece.y
          ] !== null
        ) {
          return false;
        }
      }
      if (
        chessBoard[x][y] === null ||
        chessBoard[x][y].type[0] !== piece.type[0]
      ) {
        return true;
      }
    }

    // Bishop movement
    if (
      (piece.type === "Bbishop" ||
        piece.type === "Wbishop" ||
        piece.type === "Bqueen" ||
        piece.type === "Wqueen") &&
      Math.abs(x - piece.x) === Math.abs(y - piece.y)
    ) {
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
      if (
        chessBoard[x][y] === null ||
        chessBoard[x][y].type[0] !== piece.type[0]
      ) {
        return true;
      }
    }

    // King movement
    if (
      (piece.type === "Bking" ||
        piece.type === "Wking" ||
        piece.type === "Wkingmoved" ||
        piece.type === "Bkingmoved") &&
      Math.abs(x - piece.x) <= 1 &&
      Math.abs(y - piece.y) <= 1
    ) {
      // Ensure target square is either empty or occupied by an opponent's piece
      if (
        chessBoard[x][y] === null ||
        chessBoard[x][y].type[0] !== piece.type[0]
      ) {
        return true;
      }
    }

    // Castling logic for White king
    if (
      piece.type === "Wking" &&
      x === 7 &&
      y === 6 &&
      piece.x === 7 &&
      piece.y === 4 &&
      chessBoard[7][7] &&
      chessBoard[7][7].type === "Wrook"
    ) {
      if (
        !chessBoard[7][5] &&
        !chessBoard[7][6] &&
        !isKingInCheck(piece.type, 7, 5) &&
        !isKingInCheck(piece.type, 7, 6)
      ) {
        return true;
      }
    }
    if (
      piece.type === "Wking" &&
      x === 7 &&
      y === 2 &&
      piece.x === 7 &&
      piece.y === 4 &&
      chessBoard[7][0] &&
      chessBoard[7][0].type === "Wrook"
    ) {
      if (
        !chessBoard[7][1] &&
        !chessBoard[7][2] &&
        !chessBoard[7][3] &&
        !isKingInCheck(piece.type, 7, 1) &&
        !isKingInCheck(piece.type, 7, 2) &&
        !isKingInCheck(piece.type, 7, 3)
      ) {
        return true;
      }
    }

    // Castling logic for black king
    if (
      piece.type === "Bking" &&
      x === 0 &&
      y === 6 &&
      piece.x === 0 &&
      piece.y === 4 &&
      chessBoard[0][7] &&
      chessBoard[0][7].type === "Brook"
    ) {
      if (
        !chessBoard[0][5] &&
        !chessBoard[0][6] &&
        !isKingInCheck(piece.type, 0, 5) &&
        !isKingInCheck(piece.type, 0, 6)
      ) {
        return true;
      }
    }
    if (
      piece.type === "Bking" &&
      x === 0 &&
      y === 2 &&
      piece.x === 0 &&
      piece.y === 4 &&
      chessBoard[0][0] &&
      chessBoard[0][0].type === "Brook"
    ) {
      if (
        !chessBoard[0][1] &&
        !chessBoard[0][2] &&
        !chessBoard[0][3] &&
        !isKingInCheck(piece.type, 0, 1) &&
        !isKingInCheck(piece.type, 0, 2) &&
        !isKingInCheck(piece.type, 0, 3)
      ) {
        return true;
      }
    }

    // Knight movement
    if (piece.type === "Bknight" || piece.type === "Wknight") {
      const dx = Math.abs(x - piece.x);
      const dy = Math.abs(y - piece.y);
      if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
        // Ensure target square is either empty or occupied by an opponent's piece
        if (
          chessBoard[x][y] === null ||
          chessBoard[x][y].type[0] !== piece.type[0]
        ) {
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
        if (isMoveValid(piece, x, y, chessBoard)) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  };

  const renderPiece = (piece, x, y) => {
    if (!piece) return null;
    const PieceComponent = {
      Bpawn,
      Wpawn,
      Brook,
      Wrook,
      Bbishop,
      Wbishop,
      Bknight,
      Wknight,
      Wqueen,
      Bqueen,
      Wking,
      Bking,
      Bpawnmoved,
      Wpawnmoved,
      Brookmoved,
      Wrookmoved,
      Wkingmoved,
      Bkingmoved,
    }[piece.type];
    return <PieceComponent draggable="true" x={x} y={y} />;
  };

  const isHighlight = (x, y) =>
    validMoves.some((move) => move.x === x && move.y === y);

  const isCheckmateCondition = (Player) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        const piece = chessBoard[i][j];

        if (piece && piece.type[0] === Player) {
          console.log(Player);
          const moves = calculateValidMoves(piece);
          for (let k = 0; k < moves.length; k++) {
            const { x, y } = moves[k];

            if (!isCheckAfterMove(piece, x, y)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const isCheckAfterMove = (piece, x, y) => {
    const newBoard = chessBoard.map((row) => row.slice());
    newBoard[x][y] = { ...piece, x, y };
    newBoard[piece.x][piece.y] = null;
    let kingType = piece.type[0] === "W" ? "Wking" : "Bking";
    let kingPosition = findKingPosition(kingType, newBoard);
    console.log(kingPosition);
    if (kingPosition === null) {
      kingType = player === "W" ? "Wkingmoved" : "Bkingmoved";

      kingPosition = findKingPosition(kingType, newBoard);
    }
    return isselfKingInCheck(
      kingType,
      kingPosition.x,
      kingPosition.y,
      newBoard
    );
  };
  useEffect(() => {
    if (chessBoard.length > 0) {
      let ans = isCheckmateCondition(player);
      if (ans) setfinal(1);
    }
  }, [chessBoard, player]);
  

  
   
 


  useEffect(() => {
    // Listen for incoming moves
    const handleMove = (moveData) => {
      // Update the chessboard state with the new move
      console.log(moveData)
      setChessBoard(moveData.move);
      setplayer(moveData.player)
    };
  
    socket.on('move', handleMove);
  
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('move', handleMove);
    };
  }, []);
  

  return (
    <div
      className="responsive"
      style={{ display: "flex", width: "100%", alignItems: "center" }}
    >
      <div style={{  transform:`${props.players===0?"rotateX(180deg)":"rotateX(0deg)"}`}}>
        {chessBoard.length > 0 &&
          chessBoard.map((row, rIndex) => {
            return (
              <div className="row" key={rIndex} >
                {row.map((piece, cIndex) => {
                  return (
                    <div
                      className={`box ${
                        (rIndex + cIndex) % 2 === 0
                          ? `black ${rIndex}${cIndex}`
                          : `white ${rIndex}${cIndex}`
                      } ${
                        isHighlight(rIndex, cIndex)
                          ? chessBoard[rIndex][cIndex] != null
                            ? "highlighted-takes"
                            : "highlighted"
                          : ""
                      }`}
                      key={cIndex}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "calc(100vw / 8)", // Set height based on viewport width
                        width: "calc(100vw / 8)", // Set width based on viewport width
                        maxWidth: "72px", // Limit maximum width to 80px
                        maxHeight: "72px",
                        transform:`${props.players===0?"rotateX(180deg)":"rotateX(0deg)"}`
                        
                        // Limit maximum height to 80px
                      }}
                      onClick={() => handlePieceClick(rIndex, cIndex)}
                      onDragStart={() => {
                        handlePieceClick(rIndex, cIndex);
                      }}
                      onDragOver={handlePieceDragOver}
                      onDrop={() => handlePieceClick(rIndex, cIndex)}
                    >
                      {show != null &&
                        show.x === rIndex &&
                        show.y === cIndex && (
                          <div
                            className="promotion-dropdown"
                            style={{
                              zIndex: 2,
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                              position: "absolute",
                              right: "2%",
                              top: "20%",
                              
                            }}
                          >
                            <button
                              onClick={() => {
                                chessBoard[rIndex][cIndex].type =
                                  chessBoard[rIndex][cIndex].type[0] + "queen";
                                setshow(null);
                              }}
                            >
                              {chessBoard[rIndex][cIndex].type[0] === "B" ? (
                                <Bqueen />
                              ) : (
                                <Wqueen />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                chessBoard[rIndex][cIndex].type =
                                  chessBoard[rIndex][cIndex].type[0] + "rook";
                                setshow(null);
                              }}
                            >
                              {chessBoard[rIndex][cIndex].type[0] === "B" ? (
                                <Brook />
                              ) : (
                                <Wrook />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                chessBoard[rIndex][cIndex].type =
                                  chessBoard[rIndex][cIndex].type[0] + "bishop";
                                setshow(null);
                              }}
                            >
                              {chessBoard[rIndex][cIndex].type[0] === "B" ? (
                                <Bbishop />
                              ) : (
                                <Wbishop />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                chessBoard[rIndex][cIndex].type =
                                  chessBoard[rIndex][cIndex].type[0] + "knight";
                                setshow(null);
                              }}
                            >
                              {chessBoard[rIndex][cIndex].type[0] === "B" ? (
                                <Bknight />
                              ) : (
                                <Wknight />
                              )}
                            </button>
                          </div>
                        )}
                      {renderPiece(piece, rIndex, cIndex)}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
      <div style={{ alignContent: "center", paddingLeft: "2%" }}>
        <h1>Player-{player}</h1>
        {final ? `player - ${player} lost` : null}
      </div>
    </div>
  );
}
