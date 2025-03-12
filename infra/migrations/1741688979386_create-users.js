exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    //For reference, Github limits usernames to 39 characteres.
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // 254 length is the maximum allowed for a email address.
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // Why 60 length? https://www.npmjs.com/package/bcrypt#user-content-hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    // Why timestamp with time zone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
