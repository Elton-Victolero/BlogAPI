import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function AddPostPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    coverImage: ""
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPostId, setEditPostId] = useState(null); // for update reference

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/posts/addPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire("Success!", "Post added successfully!", "success");
        navigate(`/posts/${data._id}`);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to add post", "error");
      });
  };

  const handleUpdate = () => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/updatePost/${editPostId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire("Updated!", "Post updated successfully!", "success");
        setShowEditModal(false);
        navigate(`/posts/${editPostId}`);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to update post", "error");
      });
  };

  const openEditModal = (post) => {
    setPostData({
      title: post.title,
      content: post.content,
      coverImage: post.coverImage || ""
    });
    setEditPostId(post._id);
    setShowEditModal(true);
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Add New Blog Post</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Post Title"
                  value={postData.title}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  type="text"
                  name="coverImage"
                  placeholder="Cover Image URL"
                  value={postData.coverImage}
                  onChange={handleChange}
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  as="textarea"
                  name="content"
                  rows={6}
                  placeholder="Write your post content here..."
                  value={postData.content}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={12} className="text-end">
                <Button type="submit" variant="primary">
                  Submit Post
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {(user?.isAdmin || user) && (
        <div className="mt-4 text-end">
          <Button
            variant="warning"
            className="me-2"
            onClick={() => navigate("/my-posts")}
          >
            Manage My Posts
          </Button>
          <Button
            variant="info"
            onClick={() =>
              openEditModal({
                _id: "EXISTING_POST_ID",
                title: "Sample Title",
                content: "Existing content",
                coverImage: "https://..."
              })
            }
          >
            Open Edit Modal (Demo)
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={postData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control
                name="coverImage"
                value={postData.coverImage}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={postData.content}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
