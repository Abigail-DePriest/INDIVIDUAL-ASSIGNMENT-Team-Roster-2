import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { updateMember, createMember } from '../../api/memberData';

const initialState = {
  name: '',
  role: '',
  image: '',
};

function MemberForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateMember(formInput).then(() => router.push('/member'));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createMember(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateMember(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj.firebaseKey ? 'Update' : 'Add'} Member</h2>

      {/* FIRST NAME INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Name" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Name"
          name="name"
          value={formInput.name}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* LAST NAME INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Role" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Role"
          name="role"
          value={formInput.role}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* IMAGE INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Image" className="mb-3">
        <Form.Control
          type="url"
          placeholder="Enter an image url"
          name="image"
          value={formInput.image}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Member</Button>
    </Form>
  );
}

MemberForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    role: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

MemberForm.defaultProps = {
  obj: initialState,
};

export default MemberForm;
