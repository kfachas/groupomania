import { Fragment, useContext } from "react";

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { AppContext } from "../../../Context";
import moment from "moment";
import { DeleteOutline } from "@mui/icons-material";

const CommentItem = ({ comment, handleDeleteComment }) => {
  const { userData } = useContext(AppContext);

  const {
    text,
    first_name = "",
    last_name,
    image_url,
    owner_id,
    created_at,
  } = comment;

  const isOwner = owner_id === userData.id;

  return (
    <Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={first_name + " " + last_name} src={image_url || ""}>
            {first_name.charAt(0)}
          </Avatar>
        </ListItemAvatar>
        <Box width="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography color="secondary.main" noWrap>
              {`${isOwner ? "Vous" : first_name + " " + last_name} -  ${moment(
                created_at
              ).fromNow()}`}
            </Typography>
            {(isOwner || userData.isAdmin) && (
              <IconButton
                onClick={() => handleDeleteComment(comment.id)}
                color="primary"
              >
                <DeleteOutline />
              </IconButton>
            )}
          </Box>

          <Typography variant="body2" color="#FFF">
            {text}
          </Typography>
        </Box>
      </ListItem>
    </Fragment>
  );
};

export default CommentItem;
