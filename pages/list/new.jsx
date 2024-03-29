import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import {
  Button,
  FormControl,
  TextField,
  Grid,
  Paper,
  Typography,
  makeStyles,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import "@fontsource/roboto/400.css";
import NewItemForm from "../../components/NewItemForm";
import { useFirebaseAuth } from "../../context/AuthContext";

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
      margin: "10px",
      minWidth: "750px",
    },
  }));
  const classes = useStyles();
  const router = useRouter();
  const { user } = useFirebaseAuth();

  const [tierListName, setTierListName] = useState("");
  const [category, setCategory] = useState("otros");
  const [variantInfoArray] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [buttonState, setButtonDisabled] = useState(false);

  const [variantNumber, setVariants] = useState(1);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

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

  const uploadList = async () => {
    await addDoc(collection(firestore, "TierLists"), {
      creator: {
        uid: user.uid,
        username: user.displayName,
      },
      name: tierListName,
      items: variantInfoArray,
      rating: 0,
      visibility: "public",
    });
    router.push("/");
  };

  const submitNewList = async (event) => {
    event.preventDefault();

    setSubmitStatus(true);
    setButtonDisabled(true);

    if (variantNumber === variantInfoArray.length) {
      uploadList();
    } else {
      setTimeout(function () {
        if (variantNumber === variantInfoArray.length) {
          uploadList();
        } else {
          setButtonDisabled(false);
        }
      }, 1200);
    }
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

            <Grid item xs={12}>
            <FormControl fullWidth className={classes.formElement}>
              <InputLabel id="category-select">Elige una Categoría:</InputLabel>
              <Select
                labelId="categorySelect"
                id="category-selector"
                value={category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value={"peliculas"}>Películas y Series</MenuItem>
                <MenuItem value={"videojuegos"}>Videojuegos</MenuItem>
                <MenuItem value={"otros"}>Otros (no imagen)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Typography variant="h6" component="div" gutterBottom style={{paddingTop: "5px"}}>
            Lista de Elementos:
          </Typography>
          {/* Variants dynamic-recursive form extensions. */}
          {[...Array(variantNumber)].map((value, index) => (
            <NewItemForm
              category = {category}
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
          <Button
            disabled={buttonState}
            onClick={submitNewList}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </FormControl>
      </div>
    </Grid>
  );
};

export default New;
