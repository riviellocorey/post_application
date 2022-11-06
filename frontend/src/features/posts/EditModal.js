import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkTitle } from '../../common/helpers';
import { updatePostBy } from './postSlice';
import { findPostByName } from '../../common/helpers';
import PostSearchBar from './PostSearchBar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const EditModal = React.memo(function({ editTitle, editBody }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [title, setTitle] = useState(editTitle || "");
  const [body, setBody] = useState(editBody || "");
  const [modalQuery, setModalQuery] = useState({ query: "", results: [] });

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.posts);

  const handleTitle = function(e) {
    const value = e.target.value;
    setTitle(value);
  };
  
  const handleBody = function(e) {
    const value = e.target.value;
    setBody(value);
  };

  const handleEdit = (query) => {
    setOpen((prev) => !prev);
    if (query) return setModalQuery({ query, results: findPostByName(data, query) });
    setModalQuery({ query: "", results: [] });
  };

  const handleReset = () => {
    setTitle("");
    setBody("");
  };
  
  const handleModalHide = () => {
    handleReset();
    setOpen((prev) => !prev);
  };


  const handleEditSubmit = () => {
    const titles = findPostByName(data, title);
    if (!checkTitle(modalQuery)) {
        handleReset();
        return setError(true);
    };
    if (titles.length === 1 && modalQuery.query !== title && titles[0].title === title) return setTitleError(true);
    const updateData = {query: modalQuery.query, data: { title, body }};
    dispatch(updatePostBy(updateData));
    setModalQuery({ query: "", results: [] });
    handleModalHide();
  };

  useEffect(() => {
    if (checkTitle(modalQuery) === true) {
      setTitle(modalQuery.results[0].title);
      setBody(modalQuery.results[0].body);
    } else handleReset();
    if (error) setError(false);
  }, [modalQuery]);

  useEffect(() => {
    if (titleError) setTitleError(false);
  }, [title]);


      
  return (
    <div>
        <Button role="button" onClick={() => handleEdit(editTitle)}>Edit Modal</Button>
        <Modal show={open} onHide={() => setOpen((prev) => !prev)} centered>
          <Modal.Header closeButton>
              <Modal.Title>{checkTitle(modalQuery) ? `Edit Post #${modalQuery.results[0].id}` : 'Edit Post'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
              <Form.Group className="mb-3" controlId="modalForm.ControlInput1">
                  <Form.Label>Select Entry</Form.Label>
                  <PostSearchBar isInvalid={error} searchQueries={modalQuery} setSearchQueries={setModalQuery}>
                      <Form.Control.Feedback type="invalid" tooltip>Invalid entry</Form.Control.Feedback>
                  </PostSearchBar>
                  <Form.Text id="entryHelpBlock" muted>
                      The entry must be exactly as the one you are replacing...
                  </Form.Text>
                  
              </Form.Group>
              <Form.Group className="mb-3" controlId="modalForm.ControlInput2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control data-testid="field-title" isInvalid={titleError} required autoComplete='off' onChange={(e) => handleTitle(e)} value={title} size="lg" type="text" />
                  <Form.Control.Feedback type="invalid" tooltip>Title already exists</Form.Control.Feedback>
              </Form.Group>
              <Form.Group
              className="mb-3"
              controlId="modalForm.ControlTextarea1"
              >
                  <Form.Label>Body</Form.Label>
                  <Form.Control data-testid="field-body" required autoComplete='off' as="textarea" value={body} onChange={(e) => handleBody(e)} rows={3}/>
              </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleModalHide}>
              Cancel
          </Button>
          <Button data-testid="submit-button" variant="warning" disabled={!checkTitle(modalQuery)} onClick={handleEditSubmit} >
              Update
          </Button>
          </Modal.Footer>
        </Modal>
    </div>
    
  )
})
export default EditModal