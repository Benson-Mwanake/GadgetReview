import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";
import API_URL from "../config";

async function addReview(review, token) {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to add review");
  }

  return res.json();
}


const ReviewSchema = Yup.object().shape({
  rating: Yup.number().required("Rating required").min(1).max(5),
  comment: Yup.string().required("Please add a comment").min(5),
});


export default function ReviewForm({ deviceId, onAdded }) {
  const { user, token } = useContext(AuthContext);

  if (!user || !token) {
    return <p>You must be logged in to post a review.</p>;
  }

  return (
    <Formik
      initialValues={{ rating: 5, comment: "" }}
      validationSchema={ReviewSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const payload = {
          deviceId: Number(deviceId), 
          rating: Number(values.rating),
          comment: values.comment,
        };

        console.log(" Submitting review payload:", payload);

        addReview(payload, token)
          .then((data) => {
            console.log("Review saved:", data);
            if (onAdded) onAdded(data); 
            resetForm();
          })
          .catch((e) => {
            console.error(" Error adding review:", e.message);
            alert("Failed: " + e.message);
          })
          .finally(() => setSubmitting(false));
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form-card">
          <label htmlFor="rating">Rating</label>
          <Field as="select" name="rating" id="rating">
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Poor</option>
            <option value={1}>1 - Terrible</option>
          </Field>
          <ErrorMessage name="rating" component="div" className="field-error" />

          <label htmlFor="comment">Comment</label>
          <Field as="textarea" name="comment" id="comment" rows="3" />
          <ErrorMessage
            name="comment"
            component="div"
            className="field-error"
          />

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn primary"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
