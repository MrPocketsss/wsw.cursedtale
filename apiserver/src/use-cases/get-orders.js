export default function buildMakeGetOrders({
  AppError,
  ArchivedList,
  ConfirmationList,
  PendingList,
}) {
  return async function (tableToView, page, rowsPerPage) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = page * rowsPerPage;

    const results = {};
    let totalDocuments;

    switch (tableToView) {
      case 'Approval':
        results.data = await PendingList.find().limit(rowsPerPage).skip(startIndex).exec();
        totalDocuments = await PendingList.countDocuments();
        break;
      case 'Confirmation':
        results.data = await ConfirmationList.find().limit(rowsPerPage).skip(startIndex).exec();
        totalDocuments = await ConfirmationList.countDocuments();
        break;
      case 'Archived':
        results.data = await ArchivedList.find().limit(rowsPerPage).skip(startIndex).exec();
        totalDocuments = await ArchivedList.countDocuments();
        break;
      default:
        break;
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        rowsPerPage: rowsPerPage,
      };
    }
    if (endIndex < totalDocuments) {
      results.next = {
        page: page + 1,
        rowsPerPage: rowsPerPage,
      };
    }

    return results;
  };
}
