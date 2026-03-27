import React from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Dynamic years (last 5 years)
const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

const DropDownButton = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  const [openMonth, setOpenMonth] = React.useState(false);
  const [openYear, setOpenYear] = React.useState(false);

  const monthRef = React.useRef(null);
  const yearRef = React.useRef(null);

  const years = getYears();

  return (
    <Stack direction="row" spacing={2}>
      {/* MONTH DROPDOWN */}
      <ButtonGroup ref={monthRef} variant="contained">
        <Button sx={{ bgcolor: "#ff6467" }}>{months[selectedMonth]}</Button>

        <Button
          size="small"
          onClick={() => setOpenMonth((prev) => !prev)}
          sx={{ bgcolor: "#ff6467" }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper open={openMonth} anchorEl={monthRef.current} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={() => setOpenMonth(false)}>
                <MenuList>
                  {months.map((month, index) => (
                    <MenuItem
                      key={month}
                      selected={index === selectedMonth}
                      onClick={() => {
                        onMonthChange(index);
                        setOpenMonth(false);
                      }}
                    >
                      {month}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* YEAR DROPDOWN */}
      <ButtonGroup ref={yearRef} variant="contained">
        <Button sx={{ bgcolor: "#ff6467" }}>{selectedYear}</Button>

        <Button
          size="small"
          onClick={() => setOpenYear((prev) => !prev)}
          sx={{ bgcolor: "#ff6467" }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper open={openYear} anchorEl={yearRef.current} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={() => setOpenYear(false)}>
                <MenuList>
                  {years.map((year) => (
                    <MenuItem
                      key={year}
                      selected={year === selectedYear}
                      onClick={() => {
                        onYearChange(year);
                        setOpenYear(false);
                      }}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
};

export default DropDownButton;
