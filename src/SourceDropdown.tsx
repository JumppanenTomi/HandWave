import { Dropdown } from 'react-bootstrap';

const SourceDropdown = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select a Source
      </Dropdown.Toggle>
      <Dropdown.Menu>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SourceDropdown;
