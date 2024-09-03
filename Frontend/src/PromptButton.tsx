
import React, { Component, ReactNode, MouseEvent } from 'react';

interface CustomButtonProps {
  onClick?: () => void;
  label: string;
}

class CustomButton extends Component<CustomButtonProps> {
  handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  render(): ReactNode {
    const { label } = this.props;

    return (
      <button onClick={this.handleClick} className="Prompts">
        {label}
      </button>
    );
  }
}

export default CustomButton;

