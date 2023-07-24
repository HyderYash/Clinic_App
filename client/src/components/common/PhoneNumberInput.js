import { forwardRef } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: "#fff",
  },
}));

const PhoneNumberInput = (props, ref) => {
  const classes = useStyles();
  return (
    <TextField
      {...props}
      style={{ width: "100%" }}
      InputProps={{
        className: classes.input,
      }}
      inputRef={ref}
      fullWidth
      size="small"
      label={props.label}
      variant="outlined"
      name="phone"
    />
  );
};
export default forwardRef(PhoneNumberInput);
