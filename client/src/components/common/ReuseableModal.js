import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Box, CircularProgress, IconButton } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReuseableModal({
  open,
  dialogTitle,
  children,
  handleClose,
  loading,
  loadingTitle,
}) {
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
      >
        <DialogTitle style={{ padding: "0px 24px" }}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>{!loading ? dialogTitle : loadingTitle}</Box>
            <Box>
              <IconButton onClick={handleClose} disabled={loading}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {!loading ? (
            children
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
