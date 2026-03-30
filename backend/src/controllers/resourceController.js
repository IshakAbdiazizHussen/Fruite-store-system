function asyncHandler(handler) {
  return async function wrapped(req, res, next) {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

function createCrudController({ list, create, update, remove }) {
  const controller = {
    list: asyncHandler(async (_req, res) => {
      const data = await list();
      res.status(200).json(data);
    }),
    create: asyncHandler(async (req, res) => {
      const data = await create(req.body || {});
      res.status(201).json(data);
    }),
  };

  if (update) {
    controller.update = asyncHandler(async (req, res) => {
      const data = await update(req.params.id, req.body || {});
      res.status(200).json(data);
    });
  }

  if (remove) {
    controller.remove = asyncHandler(async (req, res) => {
      await remove(req.params.id);
      res.status(204).send();
    });
  }

  return controller;
}

module.exports = {
  asyncHandler,
  createCrudController,
};
