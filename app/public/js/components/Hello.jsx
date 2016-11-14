import React, { PropTypes } from 'react';

function getFreshState() {
    var now = new Date();
    return {
        date: now,
        class: now.getSeconds() % 2 === 0 ? 'even' : 'odd'
    };
}

export class Hello extends React.Component {
    constructor(props) {
        super(props);

        this.state = getFreshState();
    }

    componentDidMount() {
        this.timer = setInterval(
            () => this.update(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    update() {
        this.setState(getFreshState());
    }

    render() {
        return (
            <h1 className={this.state.class}>Hello {this.props.name}, it's {this.state.date.toLocaleString()}</h1>
        );
    }
}

export const LIST = ['berto', 'lula'];

Hello.propTypes = {
    name: PropTypes.string.isRequired
};
