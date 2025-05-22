import { Container, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container>
      <br />
      <Card style={{ height: 800 }}>
       <iframe title="Practica ismael" width="800" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiYmYzZjM4MjctYTcyZC00ZjMxLWE2ZTAtZTQ3NjQ0OWZjNDFlIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
      </Card>
    </Container>
  );
};

export default Dashboard;