import EditModal from './EditModal';
import React from "react";
import Card from 'react-bootstrap/Card';

const PostCard = React.memo(function({post, index}) {
  
  return (
    <>
      <Card className="me-2 my-3" style={{ maxWidth: "100%", width: "45rem"}}> 
          <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.body}</Card.Text>
              <Card.Text>{`Post #${post.id}`}</Card.Text>
          </Card.Body>
          <div className="d-flex justify-content-start ms-3 mb-2">
              <EditModal editTitle={post.title} editBody={post.body}></EditModal>
          </div>
      </Card>
    </>
  )
});
export default PostCard