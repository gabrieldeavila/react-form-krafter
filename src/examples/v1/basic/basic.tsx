import Form from "../../../form/formContext";
import Register from "../../../register/registerContext";

function ExampleV1Basic() {
  return (
    <Register
      components={[
        {
          type: "text",
          render: (props, methods) => <input type="text" placeholder="Enter text" />,
        },
      ]}
    >
      <Form>
        <h1>Example V1 Basic</h1>
        <p>This is a basic example of using the form context.</p>
      </Form>
    </Register>
  );
}

export default ExampleV1Basic;
