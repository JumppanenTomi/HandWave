import { Container, Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import React from "react";
import Actions from "@/Actions";

export default function Settings() {
  return (
    <Container>
      <Navbar expand={"lg"}>
        <Container>
          <Nav>
            <Navbar.Text>
              <h1>
                <Link to={"/"}>
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={"xs"}
                    color={"#000"}
                  />
                </Link>{" "}
                Settings
              </h1>
            </Navbar.Text>
          </Nav>
        </Container>
      </Navbar>
      <Actions />
    </Container>
  );
}
