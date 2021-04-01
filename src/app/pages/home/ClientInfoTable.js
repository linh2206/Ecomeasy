import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import numeral from 'numeral';

const useStyles = makeStyles({
  table: {
    maxWidth: 600,
    border: 'none'
  },
});

const ClientInfoTable = props => {
  console.log(props);
  const {usages} = props
  const total = usages.length > 0 ? usages
    .map(({ returnRows }) => parseInt(returnRows, 10))
    .reduce((sum, i) => sum + i, 0) : 0;
  const classes = useStyles();
  return (
    <div>
      {usages.length > 0 && 
        <Table className={classes.table} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="left">Quantity Query</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usages.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="center">{idx + 1}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="left">
                  {numeral(parseInt(row.returnRows)).format("0,0")}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right" colSpan={2}>
                Total
              </TableCell>
              <TableCell align="left">{numeral(total).format("0,0")}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
    </div>
  );
};

export default ClientInfoTable;