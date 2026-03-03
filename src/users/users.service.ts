import { Injectable } from '@nestjs/common';
import { supabase } from '../config/supabase.config';

@Injectable()
export class UsersService {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
        saldo_uang,
        user_collections(id)
      `)
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);

    return {
      ...data,
      total_cards: data.user_collections.length,
    };
  }
}