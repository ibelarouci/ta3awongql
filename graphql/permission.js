const { shield, rule, and, or , not} = require( 'graphql-shield');

const isAuthenticated = rule()(
    async (parent, args, ctx, info) => {
      console.log(ctx.user);
     
      return Boolean(ctx.user)

    },
  )
  
  const isAdmin = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
      return ctx.user.role === 'admin'
    },
  )
  
  const isEditor = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
      return ctx.user.role === 'editor'
    },
  )

  const permissions = shield({
    Query: {
      getAllFarm:isAuthenticated,
      getFarmByOwner:isAuthenticated,
      
    },
    Mutation:{authenticate:not(isAuthenticated)}
   
  })

  module.exports = permissions;