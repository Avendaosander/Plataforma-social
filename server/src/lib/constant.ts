export const MESSAGE = {
  NEW_FOLLOWER: 'comenzó a seguirte.',
  NEW_POST: 'ha publicado un nuevo componente.',
  UPDATE_POST: 'ha editado un componente que has guardado.',
  DELETE_POST: 'ha eliminado un componente que has guardado.',
  NEW_COMMENT: 'ha comentado tu componente.',
  NEW_RATING: 'ha calificado tu componente.',
  NEW_SAVED: 'ha guardado tu componente.',
} as const;

export const SUBSCRIPTIONS_EVENTS = {
  NEW_FOLLOWER: 'NEW_FOLLOWER',
  POST_CREATED: 'POST_CREATED',
  POST_EDITED: 'POST_EDITED',
  POST_DELETED: 'POST_DELETED',
  POST_COMMENTED: 'POST_COMMENTED',
  POST_RATED: 'POST_RATED',
  POST_SAVED: 'POST_SAVED',
} as const;
