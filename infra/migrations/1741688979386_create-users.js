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
    // Why 72 length https://security.stackexchange.com/q/39849
    password: {
      type: "varchar(72)",
      notNull: true,
    },
    // Why timestamp with time zone https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
