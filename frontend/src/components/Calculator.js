import { Container } from "react-bootstrap";

export default function Calculator () {
    return (
        <Container>
            <div className="calculator">
                <div className="display">
                    <p>193456.7894562642</p>
                </div>
                <div className="buttons">
                    <div className="upper-row-buttons">
                        <div className="memory-buttons">
                            <button className="btn btn-success">MS</button>
                            <button className="btn btn-success">MR</button>
                            <button className="btn btn-success">MC</button>
                        </div>
                        <div className="clear-buttons">
                            <button className="btn btn-danger">C</button>
                            <button className="btn btn-danger">&#8612;</button>
                        </div>
                    </div>
                    <div className="main-buttons">
                        <div className="number-decimal-buttons">
                            <div className="number-buttons">
                                <div className="n7-n9-buttons">
                                    <button className="btn btn-primary">7</button>
                                    <button className="btn btn-primary">8</button>
                                    <button className="btn btn-primary">9</button>
                                </div>
                                <div className="n4-n6-buttons">
                                    <button className="btn btn-primary">4</button>
                                    <button className="btn btn-primary">5</button>
                                    <button className="btn btn-primary">6</button>
                                </div>
                                <div className="n1-n3-buttons">
                                    <button className="btn btn-primary">1</button>
                                    <button className="btn btn-primary">2</button>
                                    <button className="btn btn-primary">3</button>
                                </div>
                            </div>
                            <div className="other-buttons">
                                <button className="btn btn-primary">0</button>
                                <button className="btn btn-primary">.</button>
                            </div>
                        </div>
                        <div className="operator-buttons">
                            <button className="btn btn-primary">+</button>
                            <button className="btn btn-primary">-</button>
                            <button className="btn btn-primary">/</button>
                            <button className="btn btn-primary">*</button>
                            <button className="btn btn-danger">=</button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}