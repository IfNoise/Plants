const plantMap = {
  Hangar: {
    Room1: {
      width: `650px`,
      totalPlants: 0,
      rows: [
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
      ],
      columns: 4,
    },
    Room2: {
      width: "100%",
      totalPlants: 0,
      rows: [
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x4" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
      ],
      columns: 4,
    },
    Laboratory: {
      width: `780px`,
      totalPlants: 0,
      racks: [
                {
          shelfs: [
            {
              plants: [],
            },
            {
              plants: [],
            },
            {
              plants: [],
            },
          ],
        },
      ],
      rows: [
                {
          trays: [
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
        {
          trays: [
            { plants: [], size: "4x8" },
          ],
          numeration: "Up",
        },
      ],
      columns: 2,
  }
},
};

module.exports = plantMap;