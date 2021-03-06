defmodule Project2.Users do
  @moduledoc """
  The Users context.
  """

  import Ecto.Query, warn: false
  alias Project2.Repo

  alias Project2.Users.User

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  def get_user(id) do
    Repo.one from u in User, 
      where: u.id == ^id,
      preload: :posts
  end
  
  @doc """
  Authenticates a user

  returns {:ok, user} on success, or {:error, msg} on failure.
  """

  def authenticate_user(email, password) do
      Repo.get_by(User, email: email)
          |> Argon2.check_pass(password)
          end
  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
     attrs = Map.put(attrs, "password_hash", Argon2.hash_pwd_salt(Map.get(attrs, "password")))
            |> Map.put("pw_last_try", NaiveDateTime.utc_now())
            |> Map.put("pw_tries", 0)
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
  if Map.has_key?(attrs, :password_hash) do
    attrs = Map.put(attrs, "password_hash", Argon2.hash_pwd_salt(Map.get(attrs, "password")))
            |> Map.put("pw_last_try", NaiveDateTime.utc_now())
            |> Map.put("pw_tries", 0)
            user
            |> User.changeset(attrs)
            |> Repo.update()
  else
    user
    |> User.changeset(attrs)
    |> Repo.update()
    end
  end


  @doc """
  Deletes a User.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Project2.Friends.delete_friends_for(user.id)
    Project2.Friends.delete_friend_requests_for(user.id)
    Project2.Posts.delete_posts_for(user.id)
    Project2.Replies.delete_replies_for(user.id)
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end
end
