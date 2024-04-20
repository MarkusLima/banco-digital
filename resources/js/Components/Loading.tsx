import Spinner from 'react-bootstrap/Spinner';

export default function Loading() {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{position:'relative',width: '100vw',height: '100vh'}}>
      <Spinner animation="border" role="status" style={{position:'fixed',top: '50%',right: '50%'}}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}