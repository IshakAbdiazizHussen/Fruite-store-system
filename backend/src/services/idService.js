async function getNextCode(Model, fieldName, prefix) {
  const latest = await Model.findOne({
    [fieldName]: new RegExp(`^${prefix}\\d+$`),
  })
    .sort({ [fieldName]: -1 })
    .lean();

  const current = latest?.[fieldName] || `${prefix}000`;
  const match = String(current).match(/(\d+)$/);
  const next = (match ? Number(match[1]) : 0) + 1;

  return `${prefix}${String(next).padStart(3, "0")}`;
}

module.exports = {
  getNextCode,
};
