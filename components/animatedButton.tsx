import {
  Button,
} from "@mui/material";

interface IButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: any;
}

export const AnimatedButton = ({
  onClick,
  disabled,
  children,
}: IButtonProps) => {
  return (
    <Button
      variant="contained"
      color="inherit"
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: "#0001!important",
      }}
      className="animBtn in"
    >
      {children}
    </Button>
  );
};
