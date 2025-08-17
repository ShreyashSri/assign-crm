import React, { useState, useRef, useMemo } from 'react';
import { Box, Button, Stack, Typography, TextField } from '@mui/material';
import { 
  DataGrid, 
  GridColDef,
  GridPagination,
  GridFooterContainer,
  GridFooterContainerProps,
} from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';

interface RowData {
  id: number;
  [key: string]: any;
}

interface CustomFooterComponentProps extends GridFooterContainerProps {
  searchText?: string;
  onSearchTextChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function CustomFooterComponent(props: CustomFooterComponentProps) {
  const { searchText, onSearchTextChange, ...other } = props;
  return (
    <GridFooterContainer {...other}>
      <Box
        sx={{
          p: 1,
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          '& .MuiTablePagination-spacer': {
            display: 'none',
          },
        }}>
        <GridPagination />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchText || ''}
          onChange={onSearchTextChange}
          InputProps={{
            startAdornment: (
              <SearchIcon fontSize="small" sx={{ marginRight: 1, color: 'text.secondary' }} />
            ),
          }}
        />
      </Box>
    </GridFooterContainer>
  );
}

export function ExcelGridMUI() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [searchText, setSearchText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 1) return;

      const header = jsonData[0];
      const dataRows = jsonData.slice(1);

      const newColumns: GridColDef[] = header.map((colName) => ({
        field: colName.toString().replace(/\s+/g, ''),
        headerName: colName.toString(),
        width: 180,
      }));
      setColumns(newColumns);

      const newRows: RowData[] = dataRows.map((row, index) => {
        const rowObject: RowData = { id: index };
        header.forEach((colName, colIndex) => {
          const fieldName = colName.toString().replace(/\s+/g, '');
          rowObject[fieldName] = row[colIndex];
        });
        return rowObject;
      });
      setRows(newRows);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const filteredRows = useMemo(() => {
    if (!searchText) {
      return rows;
    }
    const lowercasedSearchText = searchText.toLowerCase();
    return rows.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowercasedSearchText)
      );
    });
  }, [rows, searchText]);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      {rows.length === 0 ? (
        <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <Typography variant="h6">Upload an Excel File</Typography>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".xlsx, .xls"
          />
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
          >
            Upload file
          </Button>
        </Stack>
      ) : (
        <DataGrid
          rows={filteredRows}
          columns={columns}
          density="compact"
          showCellVerticalBorder
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 1,
            borderColor: 'divider',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5ff',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: '#fafafa',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
            },
          }}
          slots={{
            footer: CustomFooterComponent,
          }}
          slotProps={{
            footer: {
              // @ts-ignore
              searchText: searchText,
              onSearchTextChange: handleSearchTextChange,
            },
          }}
        />
      )}
    </Box>
  );
}