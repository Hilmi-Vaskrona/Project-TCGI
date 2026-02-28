import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  async register(username: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password_hash: hashed,
        },
      ])
      .select()
      .single(); // ⬅️ penting supaya tidak return array

    if (error) throw new Error(error.message);

    return {
      message: 'User registered',
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        saldo: data.saldo_uang,
      },
    };
  }

  async login(username: string, password: string) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (!data) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, data.password_hash);
    if (!isMatch) throw new UnauthorizedException();

    const payload = { sub: data.id, username: data.username };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: data.id,
        username: data.username,
        saldo: data.saldo_uang,
      },
    };
  }
}