export default function makeGetOrders({ AppError, getOrder }) {
  return async function getOrders(req, res, next) {
    const tableToView = req.body.table;
    const page = req.body.page;
    const rowsPerPage = req.body.rowsPerPage;

    if (!tableToView) return next(new AppError(`No table was provided`, 400));
    if (!['Approval', 'Confirmation', 'Archived'].includes(tableToView))
      return next(new AppError('There is no table with that name', 400));
    if (!page) return next(new AppError(`No page was provided`, 400));
    if (!rowsPerPage) return next(new AppError(`No rows provided`, 400));

    const results = await getOrder(tableToView, parseInt(page), parseInt(rowsPerPage));

    if (!results) return next(new AppError(`Could not get that table`, 401));

    res.status(200).json(results).send();
  };
}
