import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function InstructorReportForm() {
  const {
    handleSubmit,
  } = useForm(
  );

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <p>Click this button to generate an instructor report!</p>
      <Button type="submit" data-testid="InstructorReport-Submit-Button">Submit</Button>
  </Form>
  );
}