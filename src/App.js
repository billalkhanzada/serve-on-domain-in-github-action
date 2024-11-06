import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const DataTable = ({ id, url, columns, children }) => {
  const [draw, setDraw] = useState(1);
  const tableRef = useRef(null);
  useEffect(() => {
    if (!$.fn.DataTable.isDataTable(`#${id}`)) {
      tableRef.current = $(`#${id}`).DataTable({
        columns: columns,
        ajax: {
          url: url,
          type: 'GET',
          data: function (data) {
            delete data.search.regex;
            setDraw(data.draw);
            const pageNumber = Math.floor(data.start / data.length);
            data.page = pageNumber > 0 ? pageNumber : 1;
            return data;
          },
          dataSrc: function (json) {
            json.draw = draw;
            json.recordsTotal = json.meta.total;
            json.recordsFiltered = json.meta.per_page;
            return json.data;
          },
          error: function () {
            toast.error('Something went wrong');
          },
        },
        serverSide: true,
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        processing: true,
      });
    }
    return () => {
    };
  }, [id, url, columns, draw]);

  return (
      <div className="dataTable-container">
        {children}
      </div>
  );
};

export default DataTable;
