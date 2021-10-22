import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import {
  Button,
  FormControl,
  TextField,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import "@fontsource/roboto/400.css";
import NewItemForm from "../../components/NewItemForm";

const New = () => {
  const useStyles = makeStyles((theme) => ({
    vertical_center: {
      width: "100%",
      margin: "0",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    formElement: {
      margin: "5px",
      minWidth: "750px",
    },
  }));
  const classes = useStyles();

  const [tierListName, setTierListName] = useState("");
  const [variantInfoArray] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [buttonState, setButtonDisabled] = useState(false);

  const [variantNumber, setVariants] = useState(1);

  const handleVariantChange = (variantInfo) => {
    variantInfoArray.push(variantInfo);
  };

  const handleVariants = (e, action) => {
    if (action === "add") setVariants(variantNumber + 1);
    if (action === "remove") {
      if (variantNumber > 1) setVariants(variantNumber - 1);
    }
    e.preventDefault();
  };

  const submitNewList = async (event) => {
    event.preventDefault();

    setSubmitStatus(true);
    setButtonDisabled(true);

    await setDoc(doc(firestore, "TierLists"), {
      name: tierListName,
      items: variantInfoArray,
      rating: 0,
      visibility: "public",
    });
  };

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={1}
      justifyContent="center"
      className={classes.vertical_center}
      component={Paper}
      elevation={6}
      square
    >
      <div className={classes.paper}>
        <FormControl className={classes.formElement}>
          <Grid item xs={12}>
            <Typography variant="h4" component="div" gutterBottom>
              Nueva TopList
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="tierListName"
              label="Tierlist Name"
              variant="outlined"
              fullWidth="true"
              value={tierListName}
              onChange={(e) => setTierListName(e.target.value)}
            />
          </Grid>
          <Typography variant="h6" component="div" gutterBottom>
            Lista de Elementos:
          </Typography>
          {/* Variants dynamic-recursive form extensions. */}
          {[...Array(variantNumber)].map((value, index) => (
            <NewItemForm
              variant_id={index + 1}
              key={index}
              sendToParent={handleVariantChange}
              submitFlag={submitStatus}
            />
          ))}

          <Grid item xs={12}>
            <Button
              color="primary"
              type="button"
              onClick={(e) => handleVariants(e, "add")}
            >
              Añadir otro elemento
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              type="button"
              onClick={(e) => handleVariants(e, "remove")}
            >
              Remover último elemento
            </Button>
          </Grid>
          <Button onClick={submitNewList} variant="contained" color="primary">
            Submit
          </Button>
        </FormControl>
      </div>
    </Grid>
  );
};

export default New;