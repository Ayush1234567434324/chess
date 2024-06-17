// src/components/CustomDialog.js
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

function CustomDialog({ open, title, contentText, children, handleContinue }) {
  return (
    <Dialog open={open} onClose={() => {}}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{contentText}</p>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleContinue} color="primary">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomDialog;
